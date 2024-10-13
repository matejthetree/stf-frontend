<script lang="ts">
	import { imageC } from '../store/image.store';
	let imgElement: HTMLImageElement | null = null;

	$: {
		console.log('image received', $imageC);
	}

	// Function to trigger fullscreen mode
	function goFullScreen() {
		if (imgElement) {
			if (imgElement.requestFullscreen) {
				imgElement.requestFullscreen();
			}
		}
	}
</script>

<div class="relative">
	{#if $imageC !== ''}
		<img bind:this={imgElement} src={`${$imageC}`} alt="Processed Webcam Frame"
				 class="rounded-lg shadow-lg border border-gray-300" />
		<!-- Fullscreen button -->
		<button on:click={goFullScreen} class="absolute bottom-4 right-4 bg-blue-500 text-white p-2 rounded-lg">
			Full Screen
		</button>
	{:else}
		<p class="text-gray-500">Waiting for processed image...</p>
	{/if}
</div>