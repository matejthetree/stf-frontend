<script lang="ts">
	let started = false;

	// Function to toggle start/stop state
	function toggleStartStop() {
		started = !started; // Toggle between start and stop
	}
</script>

<div>
	{#if started}
		<!-- Stop Button with red background -->
		<button
			type="button"
			class="btn-icon btn-icon-xl variant-filled  border-green-500 border-8"
			on:click={toggleStartStop}
		>
			[||]
		</button>
	{:else}
		<!-- Start Button with green background -->
		<button
			type="button"
			class="btn-icon btn-icon-xl variant-filled"
			on:click={toggleStartStop}
		>
			|>
		</button>
	{/if}
</div>