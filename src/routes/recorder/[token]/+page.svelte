<script lang="ts">
	import { onMount } from 'svelte';
	import WebCam from '../../../components/WebCam.svelte';
	import Renderer from '../../../components/Renderer.svelte';
	import { started, token } from '../../../store/ai-params.store';
	import StartStop from '../../../components/StartStop.svelte';
	import AIStrength from '../../../components/AIStrength.svelte'; // Import your Recorder component
	export let data: any; // Receive the token from load function as a prop


	token.set(data.token);
	started.set(true);
	onMount(() => {
		console.log('token', token);
	});
</script>

<!-- The Recorder page layout -->
<div class="flex flex-col items-start h-screen bg-gray-100">
	<div class="items-stretch border border-gray-300 flex justify-center">
		<WebCam />
	</div>

	<div class="justify-items-stretch border border-gray-300 flex justify-center">
		<Renderer />
	</div>

	<AIStrength></AIStrength>
	<StartStop></StartStop>
</div>