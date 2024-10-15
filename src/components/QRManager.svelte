<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { verifyToken } from '../server/qr-manager';
	import { isConnectedTokenValid } from '../store/token.store';
	import { imageP } from '../store/image.store';

	let qrCodeDataUrl = writable('');
	let token = writable('');
	let lastVerification = writable(false);
	// Fetch the QR code from the server on component mount
	async function fetchQRCode() {
		const response = await fetch('/api/generate-qr');
		const data = await response.json();

		if (response.ok) {
			qrCodeDataUrl.set(data.qrCodeDataUrl); // Set the QR code data URL
			token.set(data.token); // Set the token
			console.log(data);
		} else {
			console.error('Error fetching QR code:', data.error);
		}
	}


	// Regenerate QR code on button click
	function regenerateQRCode() {
		fetchQRCode();
	}

	$: {
		console.log('imageP received', $imageP.substring(0,20));
	}

	async function checkLastVerification() {
		try {
			// Make a GET request to verify the token, passing the token in the URL
			const response = await fetch(`/api/last-verification-token`, {
				method: 'GET'
			});

			const result = await response.json();
			lastVerification.set(result.lastVerification)
		} catch (error) {
			console.error('Error verifying token:', error);
			isConnectedTokenValid.set(false);  // Assume disconnected if there is an error
		}
	}

	// Set up interval to verify the token every second
	onMount(async () => {
		await fetchQRCode();
		const interval = setInterval(checkLastVerification, 1000);  // Verify every second

		// Clean up the interval when the component is destroyed
		onDestroy(() => {
			clearInterval(interval);
		});
	});
</script>

<div class="flex flex-col items-center justify-center ">

	{#if $qrCodeDataUrl}
		{#if $lastVerification && $imageP !== ''}
			<img src={`data:image/jpeg;base64,${$imageP}`} alt="Processed Webcam Frame"
					 class="rounded-lg shadow-lg border border-gray-300" />

		{:else}
			<img src={$qrCodeDataUrl} alt="QR Code" class="w-48 mb-4" />
			<p class="text-gray-600 mb-4">Scan the QR code to start streaming</p>

		{/if}
	{/if}

	<button on:click={regenerateQRCode}
					class="absolute top-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
		Regenerate QR Code
	</button>

</div>