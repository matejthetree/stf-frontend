<script lang="ts">
	import { onMount } from 'svelte';
	import Screens from '../components/Screens.svelte';
	import Prompt from '../components/Prompt.svelte';
	import StartStop from '../components/StartStop.svelte';
	import CustomSlider from '../components/CustomSlider.svelte';
	import { writable } from 'svelte/store';
	import { aiStrength, promptC, guidance_scale, inference_steps, 
		control_guidance_start, control_guidance_end ,sendParamsToApi } from '../store/ai-params.store';
	import FSButton from '../components/FSButton.svelte';

	const correctPassword = 'nvidiaxmicrosoft';
	let isAuthenticated = writable(false);
	let inputPassword = '';
	let ready = false;

	let timeoutId: any = null;
	let imgElement: HTMLDivElement | null = null;

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
				console.log($promptC, $aiStrength, $guidance_scale, $inference_steps, $control_guidance_start, $control_guidance_end);
				sendParamsToApi();
			}, 1000); // 1-second debounce delay
		}
	}

	// Function to trigger fullscreen mode
</script>

{#if $isAuthenticated}
	<!-- Show the content if the user is authenticated -->
	<div class="flex flex-col h-screen"  bind:this={imgElement}>
		<!-- Screens component takes some space at the top -->
		<div class="flex-initial p-6">
			<Screens />
		</div>

		<!-- Prompt component takes some space below the screens -->
		<div class="flex-none w-4/5 mx-auto ">
			<Prompt />
		</div>

		<!-- Remaining space taken by the slider and buttons -->

		<div class="flex-none w-4/5 mx-auto">
			<!-- Slider on the left -->
			<CustomSlider value={aiStrength} min={0} max={1} step={0.05} label="AI Strength test" />

			<!-- Start/Stop button at the bottom-right corner -->
		</div>
		<div class="flex-none w-4/5 mx-auto ">
			<CustomSlider value={inference_steps} min={1} max={15} step={1} label="Inference Steps" />
		</div>
		<div class="flex-none w-4/5 mx-auto ">
			<CustomSlider value={guidance_scale} min={1} max={6} step={0.01} label="Guidance Scale" />
		</div>
		<div class="flex-none w-4/5 mx-auto ">
			<CustomSlider value={control_guidance_start} min={0} max={1} step={0.01} label="Control Guidance Start" />
		</div>
		<div class="flex-none w-4/5 mx-auto ">
			<CustomSlider value={control_guidance_end} min={0} max={1} step={0.01} label="Control Guidance End" />
		</div>
		<br>
		<div class="absolute bottom-6 right-6">
			<StartStop />
		</div>

		<FSButton></FSButton>

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