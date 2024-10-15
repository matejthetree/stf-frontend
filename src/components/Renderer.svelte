<script lang="ts">
	import { imageC } from '../store/image.store';

	$: {
		console.log('image received', $imageC);
	}


</script>

<div class="relative">
	{#if $imageC !== ''}
		<img  src={`${$imageC}`} alt="Processed Webcam Frame"
				 class="rounded-lg shadow-lg border border-gray-300" />
		<!-- Fullscreen button -->
	{:else}
		<p class="text-gray-500">Waiting for processed image...</p>
	{/if}
</div>