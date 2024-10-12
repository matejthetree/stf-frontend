<script lang="ts">
	import { isRecording, started } from '../store/ai-params.store';  // Import the shared store
	import { get } from 'svelte/store';   // Helper to get the current store value

	// Function to toggle start/stop state
	function toggleStartStop() {
		isRecording.set(!get(isRecording));  // Toggle between true and false
	}
</script>

<div>
	{#if !$started}
		<div>

		</div>
	{:else}
		{#if $isRecording}
			<!-- Stop Button with red background -->
			<button
				type="button"
				class="btn-icon btn-icon-xl variant-filled border-red-500 border-8"
				on:click={toggleStartStop}
			>
				REC
			</button>
		{:else}
			<!-- Start Button with green background -->
			<button
				type="button"
				class="absolute bottom-4 right-4 btn-icon btn-icon-xl variant-filled border-green-500 border-8"
				on:click={toggleStartStop}
			>
				|>
			</button>
		{/if}	{/if}
</div>