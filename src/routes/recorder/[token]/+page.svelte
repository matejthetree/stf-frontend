<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import WebCam from '../../../components/WebCam.svelte';
	import Renderer from '../../../components/Renderer.svelte';
	import { started, token } from '../../../store/ai-params.store';
	import StartStop from '../../../components/StartStop.svelte';
	import { writable } from 'svelte/store';

	export let data: any; // Receive the token from load function as a prop

	let isConnected = writable(true);  // To track connection status

	// Set the token and start the recording
	token.set(data.token);
	started.set(true);

	// Function to verify the token validity
	async function verifyTokenPeriodically() {
		try {
			// Make a GET request to verify the token, passing the token in the URL
			const response = await fetch(`/api/verify-token?token=${data.token}`, {
				method: 'GET'
			});

			const result = await response.json();
			if (!result.valid) {
				isConnected.set(false);  // Mark as disconnected if the token is not valid
			}
		} catch (error) {
			console.error('Error verifying token:', error);
			isConnected.set(false);  // Assume disconnected if there is an error
		}
	}

	// Set up interval to verify the token every second
	onMount(() => {
		const interval = setInterval(verifyTokenPeriodically, 1000);  // Verify every second

		// Clean up the interval when the component is destroyed
		onDestroy(() => {
			clearInterval(interval);
		});
	});
</script>

<!-- The Recorder page layout -->
{#if $isConnected}
	<div class="flex flex-col items-start h-screen bg-gray-100">
		<div class="items-start border border-gray-300 flex justify-center">
			<WebCam />
		</div>

		<div class="justify-items-stretch border border-gray-300 flex justify-center">
			<Renderer />
			<!-- Start/Stop button hovering on top in lower right -->
			<StartStop  />
		</div>
	</div>
{:else}
	<!-- Show this when disconnected -->
	<div class="flex justify-center items-center h-screen">
		<h1 class="text-4xl font-bold text-red-500">DISCONNECTED</h1>
	</div>
{/if}