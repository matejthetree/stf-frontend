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

<!-- Recorder Layout -->
{#if $isConnected}
	<div class="relative" style="height: calc(100vh - 64px); width: 100vw;">
		<!-- Renderer takes full space minus navbar -->
		<div class="h-full w-full flex items-center justify-center">
			<div class="max-w-full max-h-full">
				<Renderer />
			</div>
		</div>

		<!-- Webcam hovering in the top right -->
		<div class="absolute top-4 right-4 w-1/4 aspect-auto">
			<WebCam />
		</div>

		<!-- Start/Stop button hovering in the bottom right -->
		<div class="absolute bottom-4 right-4">
			<StartStop />
		</div>
	</div>
{:else}
	<!-- Show this when disconnected -->
	<div class="flex justify-center items-center h-screen">
		<h1 class="text-4xl font-bold text-red-500">DISCONNECTED</h1>
	</div>
{/if}