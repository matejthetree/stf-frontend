<script lang="ts">
	import QRManager from './QRManager.svelte';
	import Renderer from './Renderer.svelte';
	import WebCam from './WebCam.svelte';
	import { writable } from 'svelte/store';
	import { started } from '../store/ai-params.store';

	// Store to keep track of which component is active
	let activeComponent = writable<'webcam' | 'qr' | ''>('');

	// Handlers for button clicks
	const showWebcam = () => {
		started.set(true);
		activeComponent.set('webcam');
	};
	const showQRManager = () => {
		activeComponent.set('qr');
	};
	const resetComponent = () => {
		started.set(false);
		activeComponent.set('');
		resetToken()
	};

	async function resetToken() {
		const response = await fetch('/api/reset-token');
		const data = await response.json();

		if (response.ok) {
			console.log(data);
		} else {
			console.error('Error reseting token:', data.error);
		}
	}

</script>

<div class="flex flex-wrap justify-center gap-4 lg:flex-nowrap">
	<!-- Left Box with Buttons or Components -->
	<div class="w-[512px] h-[768x] border border-gray-300 relative flex flex-col items-center justify-center gap-4">
		{#if $activeComponent === 'webcam'}
			<WebCam />
			<!-- X button overlay to reset state -->
			<button on:click={resetComponent}
							class="absolute top-2 right-2 text-white bg-red-500 rounded w-6 h-6 hover:bg-red-200 transition">
				X
			</button>
		{:else if $activeComponent === 'qr'}
			<QRManager />
			<!-- X button overlay to reset state -->
			<button on:click={resetComponent}
							class="absolute top-2 right-2 text-white bg-red-500 rounded w-6 h-6 hover:bg-red-200 transition">
				X
			</button>
		{:else}
			<!-- Buttons to start Webcam or QR Code -->
			<div class="flex gap-2">
				<button on:click={showWebcam}
								class="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-200">
					Start Webcam
				</button>

				<button on:click={showQRManager}
								class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
					Scan QR Code
				</button>
			</div>
		{/if}
	</div>

	<!-- Right Box with Renderer -->
	<div class="w-[512px] h-[768px] border border-gray-300 flex items-center justify-center">
		<Renderer />
	</div>
</div>