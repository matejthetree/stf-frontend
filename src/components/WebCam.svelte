<script lang="ts">
	import { onDestroy } from 'svelte';
	import { token } from '../store/recording-state.store';

	let fps = 1;

	let videoElement: HTMLVideoElement | null = null;
	let canvas: HTMLCanvasElement | null = null;
	let intervalId: number | null = null;
	const apiUrl = `http://localhost:5173/recorder/${token}/`;

	// Reusable canvas for capturing frames
	function initializeCanvas() {
		canvas = document.createElement('canvas');
		if (videoElement) {
			canvas.width = videoElement.videoWidth;
			canvas.height = videoElement.videoHeight;
		}
	}

	// Start the webcam stream
	async function startWebcam() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			if (videoElement) {
				videoElement.srcObject = stream;
				await videoElement.play();

				initializeCanvas(); // Initialize the reusable canvas

				// Send a frame every second (1 FPS)
				intervalId = window.setInterval(captureAndSendFrame, 1000 / fps);
			}
		} catch (err) {
			console.error('Error accessing the webcam', err);
		}
	}

	// Capture a frame from the webcam and send it to the API
	async function captureAndSendFrame() {
		if (!videoElement || !canvas) return;

		const context = canvas.getContext('2d');
		if (!context) return;

		// Draw the current video frame on the canvas
		context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

		// Convert canvas to blob
		canvas.toBlob(async (blob) => {
			if (blob) {
				const formData = new FormData();
				formData.append('frame', blob, 'frame.jpg');

				try {
					const response = await fetch(apiUrl, {
						method: 'POST',
						body: formData
					});

					if (!response.ok) {
						console.error('Error sending frame:', response.statusText);
					}
				} catch (err) {
					console.error('Error sending frame', err);
				}
			}
		}, 'image/jpeg', 0.7); // Adjust the quality factor (0.7) if needed
	}

	// Clean up the interval and stream when the component is destroyed
	onDestroy(() => {
		if (intervalId !== null) {
			clearInterval(intervalId); // Clear the interval on destroy
		}

		if (videoElement && videoElement.srcObject) {
			const stream = videoElement.srcObject as MediaStream;
			const tracks = stream.getTracks();
			tracks.forEach(track => track.stop()); // Stop all media tracks
		}
	});
</script>

<div class="flex flex-col items-center justify-center h-screen">
	<h1 class="text-2xl font-bold mb-4">Webcam Recorder</h1>
	<video bind:this={videoElement} autoplay class="w-full max-w-md h-auto border border-gray-300 rounded-lg">
		<track kind="captions" src="webscam">
	</video>
	<button on:click={startWebcam}
					class="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-200">
		Start Webcam
	</button>
</div>