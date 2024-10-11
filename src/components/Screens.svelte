<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import QRManager from './QRManager.svelte';
	import Renderer from './Renderer.svelte';
	import WebCam from './WebCam.svelte';
</script>

<div class="flex flex-wrap justify-center gap-4 lg:flex-nowrap">
	<div class="w-[512px] h-[512px] border border-gray-300 flex items-center justify-center">
		<WebCam></WebCam>
	</div>
	<div class="w-[512px] h-[512px] border border-gray-300 flex items-center justify-center">
		<Renderer />
	</div>
</div>

