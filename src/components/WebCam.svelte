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
		return /android|iPad|iPhone|iPod/i.test(userAgent); // Basic mobile device detection
	}

	// Start the webcam in the browser
	async function startWebcam() {
		if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
			try {
				isMobileDevice = detectMobileDevice();

				// Set video constraints based on whether it's a mobile device
				let videoConstraints;
				if (isMobileDevice) {
					// Flexible constraints for iOS compatibility
					videoConstraints = {
						facingMode: { ideal: 'environment' }, // Use "ideal" instead of "exact" for iOS compatibility
						aspectRatio: 512 / 768, // Portrait aspect ratio
						width: { ideal: canvasWidth },
						height: { ideal: canvasHeight }
					};
				} else {
					// Constraints for non-mobile devices
					videoConstraints = {
						width: canvasWidth,
						height: canvasHeight
					};
				}

				const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
				if (videoElement) {
					videoElement.srcObject = stream;
					await videoElement.play();

					initializeCanvas();

					// Start capturing frames
					intervalId = window.setInterval(captureFrame, 1000 / fps);
				}
			} catch (err) {
				console.error('Error accessing the webcam:', err);
				// Provide user-friendly error messages for iOS
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

		// Fit the video frame into the 512x768 canvas, maintaining aspect ratio
		const videoAspectRatio = videoElement.videoWidth / videoElement.videoHeight;
		const canvasAspectRatio = canvasWidth / canvasHeight;

		let sx, sy, sWidth, sHeight;
		if (videoAspectRatio > canvasAspectRatio) {
			// Video is wider than canvas aspect ratio, crop the sides
			sHeight = videoElement.videoHeight;
			sWidth = sHeight * canvasAspectRatio;
			sx = (videoElement.videoWidth - sWidth) / 2;
			sy = 0;
		} else {
			// Video is taller than canvas aspect ratio, crop the top and bottom
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
				const recordCallback = get(recordFrame); // Get the store callback function
				if (recordCallback) {
					recordCallback(blob); // Send the frame to the store if recording
				}
			}
		}, 'image/jpeg', 0.7); // Adjust image quality as needed
	}

	// Use onMount to ensure the code runs in the browser
	onMount(() => {
		startWebcam();
	});

	// Clean up when the component is destroyed
	onDestroy(() => {
		if (intervalId !== null) {
			clearInterval(intervalId);
		}
		if (videoElement && videoElement.srcObject) {
			const stream = videoElement.srcObject as MediaStream;
			const tracks = stream.getTracks();
			tracks.forEach(track => track.stop()); // Stop all media tracks
		}
	});
</script>

<!-- Displaying Webcam with cropped frame on the screen (512x768) -->
<video bind:this={videoElement} autoplay playsinline class="h-[240px] w-[160px] object-cover border border-gray-300 rounded-lg">
	<track kind="captions" src="webcam">
</video>