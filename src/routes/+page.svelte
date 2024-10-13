<script lang="ts">
	import { onMount } from 'svelte';
	import Screens from '../components/Screens.svelte';
	import Prompt from '../components/Prompt.svelte';
	import StartStop from '../components/StartStop.svelte';
	import AIStrength from '../components/AIStrength.svelte';
	import { writable } from 'svelte/store';
	import { aiStrength, promptC, sendParamsToApi } from '../store/ai-params.store';

	const correctPassword = 'nvidiaxmicrosoft';
	let isAuthenticated = writable(false);
	let inputPassword = '';
	let ready = false;

	let timeoutId: any = null;

	// Check if the correct password is already stored in localStorage
	onMount(() => {
		ready = true;
		const savedPassword = localStorage.getItem('password');
		if (savedPassword === correctPassword) {
			isAuthenticated.set(true);
		}
	});

	// Handle password submission
	function submitPassword() {
		if (inputPassword === correctPassword) {
			isAuthenticated.set(true);
			localStorage.setItem('password', inputPassword); // Save password
		} else {
			alert('Incorrect password. Please try again.');
		}
	}

	$: {
		if (ready) {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			timeoutId = setTimeout(() => {
				console.log($promptC, $aiStrength);
				sendParamsToApi();
			}, 1000); // 1-second debounce delay
		}
	}
</script>

{#if $isAuthenticated}
	<!-- Show the content if the user is authenticated -->
	<div class="flex flex-col h-screen" >
		<!-- Screens component takes some space at the top -->
		<div class="flex-none h-[80%]">
			<Screens />
		</div>

		<!-- Prompt component takes some space below the screens -->
		<div class="flex-none w-4/5 mx-auto ">
			<Prompt />
		</div>

		<!-- Remaining space taken by the slider and buttons -->
		<div class="flex-none w-4/5 mx-auto ">
			<!-- Slider on the left -->
			<AIStrength />

			<!-- Start/Stop button at the bottom-right corner -->
		</div>

		<div class="absolute bottom-6 right-6">
			<StartStop />
		</div>

	</div>
{:else}
	<!-- Password prompt if not authenticated -->
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