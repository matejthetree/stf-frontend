<script lang="ts">
	import { prompt } from '../store/ai-params.store';  // Import the shared store

	export let placeholder = "Enter your prompt here...";

	// Update the prompt value in the store when the input changes
	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		prompt.set(target.value);
	}
</script>

<div class="w-full">
	<input
		type="text"
		class="w-full p-4 border border-gray-300 rounded"
		placeholder={placeholder}
		value={$prompt}
		on:input={handleInput}
	/>
</div>