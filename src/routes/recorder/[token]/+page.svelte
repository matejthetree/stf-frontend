<script lang="ts">
	import Recorder from '../../../components/WebCam.svelte';
	import { onMount } from 'svelte';
	import WebCam from '../../../components/WebCam.svelte';
	import Renderer from '../../../components/Renderer.svelte'; // Import your Recorder component
	export let data: any; // Receive the token from load function as a prop

	const token: string = data.token;
	onMount(() => {
		console.log('token', token);
	});
</script>

<!-- The Recorder page layout -->
<div class="flex flex-col items-center justify-center h-screen bg-gray-100">
	<h1 class="text-2xl font-bold mb-4">Webcam Recorder - Token: {token}</h1>
	<WebCam {token} /> <!-- Pass the token to the Recorder component -->
	<Renderer {token}></Renderer>
</div>