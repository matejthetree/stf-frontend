<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { recordFrame } from '../store/ai-params.store';

	let videoElement: HTMLVideoElement | null = null;
	let canvas: HTMLCanvasElement | null = null;
	let intervalId: number | null = null;
	let fps = 0.5;  // Set your desired FPS
	let isMobileDevice = false;
	let canvasWidth = 512;
	let canvasHeight = 768;

	// Detect if the device is mobile
	function detectMobileDevice() {
		const userAgent = navigator.userAgent || navigator.vendor;
		return /android|iPad|iPhone|iPod/i.test(userAgent);
	}

	// Start the webcam in the browser
	async function startWebcam() {
		if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
			try {
				isMobileDevice = detectMobileDevice();

				// Set video constraints
				let videoConstraints: MediaTrackConstraints = {
					facingMode: { ideal: 'environment' },
					width: { ideal: Math.max(canvasWidth, canvasHeight) },
					height: { ideal: Math.min(canvasWidth, canvasHeight) }
				};

				const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
				if (videoElement) {
					videoElement.srcObject = stream;
					await videoElement.play();

					// Adjust video element size based on its actual dimensions
					adjustVideoSize();

					initializeCanvas();

					// Start capturing frames
					intervalId = window.setInterval(captureFrame, 1000 / fps);
				}
			} catch (err) {
				console.error('Error accessing the webcam:', err);
				if (err.name === 'NotAllowedError') {
					alert('Camera access is denied. Please allow camera permissions.');
				} else if (err.name === 'NotFoundError') {
					alert('No camera found.');
				} else {
					alert('Error accessing the camera.');
				}
			}
		} else {
			console.error('navigator.mediaDevices is not available in this environment');
		}
	}

	function adjustVideoSize() {
		if (!videoElement) return;

		const aspectRatio = videoElement.videoWidth / videoElement.videoHeight;
		if (aspectRatio > 1) {
			// Landscape
			videoElement.style.width = '100%';
			videoElement.style.height = 'auto';
		} else {
			// Portrait
			videoElement.style.width = 'auto';
			videoElement.style.height = '100%';
		}
	}

	// Initialize the canvas with a fixed size (512x768)
	function initializeCanvas() {
		canvas = document.createElement('canvas');
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
	}

	// Capture the frame and send to store if recording is active
	async function captureFrame() {
		if (!videoElement || !canvas) return;

		const context = canvas.getContext('2d');
		if (!context) return;

		// Calculate the crop region
		const videoAspectRatio = videoElement.videoWidth / videoElement.videoHeight;
		const canvasAspectRatio = canvasWidth / canvasHeight;

		let sx, sy, sWidth, sHeight;
		if (videoAspectRatio > canvasAspectRatio) {
			// Video is wider, crop the sides
			sHeight = videoElement.videoHeight;
			sWidth = sHeight * canvasAspectRatio;
			sx = (videoElement.videoWidth - sWidth) / 2;
			sy = 0;
		} else {
			// Video is taller, crop the top and bottom
			sWidth = videoElement.videoWidth;
			sHeight = sWidth / canvasAspectRatio;
			sx = 0;
			sy = (videoElement.videoHeight - sHeight) / 2;
		}

		// Draw the cropped video frame onto the canvas
		context.drawImage(videoElement, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);

		// Convert the canvas to a blob (image)
		canvas.toBlob(async (blob) => {
			if (blob) {
				const recordCallback = get(recordFrame);
				if (recordCallback) {
					recordCallback(blob);
				}
			}
		}, 'image/jpeg', 0.7);
	}

	onMount(() => {
		startWebcam();
	});

	onDestroy(() => {
		if (intervalId !== null) {
			clearInterval(intervalId);
		}
		if (videoElement && videoElement.srcObject) {
			const stream = videoElement.srcObject as MediaStream;
			const tracks = stream.getTracks();
			tracks.forEach(track => track.stop());
		}
	});
</script>

<div class="relative w-full h-full overflow-hidden border border-gray-300 rounded-lg">
	<video
		bind:this={videoElement}
		autoplay
		playsinline
		class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
	>
		<track kind="captions" src="webcam">
	</video>
</div>