<script lang="ts">
	import { promptC } from '../store/ai-params.store';  // Import the shared store

	export let placeholder = "Enter your prompt here...";

	// Update the prompt value in the store when the input changes
	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		promptC.set(target.value);
	}
</script>

<div class="w-full">
	<input
		type="text"
		class="w-full p-4 border border-gray-300 rounded"
		placeholder={placeholder}
		value={$promptC}
		on:input={handleInput}
	/>
</div>