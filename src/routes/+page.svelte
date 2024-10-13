<script lang="ts">
	import { onMount } from 'svelte';
	import Screens from '../components/Screens.svelte';
	import Prompt from '../components/Prompt.svelte';
	import StartStop from '../components/StartStop.svelte';
	import AIStrength from '../components/AIStrength.svelte';
	import { writable } from 'svelte/store';

	// Password to access the page
	const correctPassword = "nvidiaxmicrosoft";

	// Store to track if the user is authenticated
	let isAuthenticated = writable(false);

	// Store for the input password field
	let inputPassword = "";

	// On component mount, check if the correct password is already in localStorage
	onMount(() => {
		const savedPassword = localStorage.getItem('password');
		if (savedPassword === correctPassword) {
			isAuthenticated.set(true);
		}
	});

	// Function to handle password submission
	function submitPassword() {
		if (inputPassword === correctPassword) {
			isAuthenticated.set(true);
			localStorage.setItem('password', inputPassword); // Save the correct password in localStorage
		} else {
			alert("Incorrect password. Please try again.");
		}
	}
</script>

{#if $isAuthenticated}
	<!-- Show the content if the user is authenticated -->
	<Screens></Screens>
	<!-- Prompt Component Below the Boxes -->
	<div class="w-8/12 mx-auto p-8">
		<Prompt />
	</div>

	<!-- Slider and Start/Stop Button Layout -->
	<div class="flex justify-between items-center mt-4 p-6">
		<!-- Slider on the left -->
		<div class="w-4/5">
			<AIStrength></AIStrength>
		</div>

		<!-- Start/Stop Buttons on the right -->
		<div class="absolute bottom-6 right-6">
			<StartStop></StartStop>
		</div>
	</div>
{:else}
	<!-- Show the password prompt if the user is not authenticated -->
	<div class="flex justify-center items-center h-screen">
		<div class="w-1/3 bg-white p-6 rounded shadow-lg">
			<h2 class="text-2xl font-bold mb-4">Enter Password</h2>
			<input
				type="password"
				bind:value={inputPassword}
				placeholder="Enter the password"
				class="w-full p-3 border border-gray-300 rounded mb-4"
			/>
			<button
				on:click={submitPassword}
				class="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
			>
				Submit
			</button>
		</div>
	</div>
{/if}