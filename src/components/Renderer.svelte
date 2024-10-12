<script lang="ts">
	import { onMount } from 'svelte';
	import { token } from '../store/recording-state.store';

	let processedImage: string | null = null;

	let sse: EventSource | null = null;

	onMount(() => {

		token.subscribe((token) => {

			if (token != '') {
				if (sse != null) {
					sse.close();
				}
				sse = new EventSource(`/recorder/${token}`);
				sse.onmessage = (event) => {
					const data = JSON.parse(event.data);
					processedImage = data.processedImage; // Update the image with SSE data
				};

				sse.onerror = () => {
					console.error('SSE connection error');
				};

			}
		});

		return () => {
			if (sse != null) {
				sse.close();
			}
		};
	});
</script>

<div class="flex flex-col items-center">
	{#if processedImage}
		<img src={`data:image/jpeg;base64,${processedImage}`} alt="Processed Webcam Frame"
				 class="max-w-full h-auto rounded-lg shadow-lg border border-gray-300" />
	{:else}
		<p class="text-gray-500">Waiting for processed image...</p>
	{/if}
</div>