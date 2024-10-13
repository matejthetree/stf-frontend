<script lang="ts">
	import { imageC } from '../store/image.store';

	$:{
		console.log('image received', $imageC);
	}

</script>

<div class="">
	{#if $imageC !== ''}
		<img src={`${$imageC}`} alt="Processed Webcam Frame"
				 class="rounded-lg shadow-lg border border-gray-300" />
	{:else}
		<p class="text-gray-500">Waiting for processed image...</p>
	{/if}
</div>