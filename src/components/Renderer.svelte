<script lang="ts">
	import { imageC } from '../store/image.store';

	$:{
		console.log('image received', $imageC);
	}

</script>

<div class="flex flex-col items-center">
	{#if $imageC !== ''}
		<img src={`${$imageC}`} alt="Processed Webcam Frame"
				 class="max-w-full h-auto rounded-lg shadow-lg border border-gray-300" />
	{:else}
		<p class="text-gray-500">Waiting for processed image...</p>
	{/if}
</div>