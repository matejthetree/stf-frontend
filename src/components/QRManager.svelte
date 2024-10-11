<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let qrCodeDataUrl = writable('');
	let token = writable('');

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

	// Call the fetchQRCode function when the component mounts
	onMount(fetchQRCode);

	// Regenerate QR code on button click
	function regenerateQRCode() {
		fetchQRCode();
	}
</script>

<div class="flex flex-col items-center justify-center h-screen ">

	{#if $qrCodeDataUrl}
		<img src={$qrCodeDataUrl} alt="QR Code" class="w-48 mb-4" />
		<p class="text-gray-600 mb-4">Scan the QR code to start streaming</p>
	{/if}

	<button on:click={regenerateQRCode} class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
		Regenerate QR Code
	</button>
</div>