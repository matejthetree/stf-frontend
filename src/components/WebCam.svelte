<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { recordFrame } from '../store/ai-params.store';

	let videoElement: HTMLVideoElement | null = null;
	let canvas: HTMLCanvasElement | null = null;
	let intervalId: number | null = null;
	let fps = 1;  // Set your desired FPS
	let isMobileDevice = false;

	// Detect if the device is mobile
	function detectMobileDevice() {
		const userAgent = navigator.userAgent || navigator.vendor || window.opera;
		return /android|iPad|iPhone|iPod/i.test(userAgent); // Basic mobile device detection
	}

	// Start the webcam in the browser
	async function startWebcam() {
		if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
			try {
				isMobileDevice = detectMobileDevice();

				// Set video constraints based on whether it's a mobile device
				const videoConstraints = isMobileDevice
					? { facingMode: { exact: 'environment' } } // Back camera for mobile devices
					: true; // Default to front camera for non-mobile

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
			}
		} else {
			console.error('navigator.mediaDevices is not available in this environment');
		}
	}

	// Initialize the canvas with a fixed size
	function initializeCanvas() {
		canvas = document.createElement('canvas');
		canvas.width = 512;
		canvas.height = 512;
	}

	// Capture the frame and send to store if recording is active
	async function captureFrame() {
		if (!videoElement || !canvas) return;

		const context = canvas.getContext('2d');
		if (!context) return;

		// Draw the video frame onto the canvas
		context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

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

<div class="w-[512px] h-[512px] flex items-center justify-center">
	<video bind:this={videoElement} autoplay class="w-full h-full border border-gray-300 rounded-lg">
		<track kind="captions" src="webcam">
	</video>
</div>