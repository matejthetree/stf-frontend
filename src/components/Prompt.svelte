<script lang="ts">
	import { promptC, promptEditing } from '../store/ai-params.store';  // Import the shared stores
	export let placeholder = "Enter your prompt here...";

	let timeoutId: number | null = null;

	// Event handlers to update stores for active and editing states
	function handleFocus() {
		if (timeoutId) {
			clearTimeout(timeoutId);  // Clear any pending timeout when focusing again
		}
		promptEditing.set(true);
	}

	function handleFocusOut() {
		// Set a timeout to delay setting `promptEditing` to false by 1 second
		timeoutId = window.setTimeout(() => {
			promptEditing.set(false);
		}, 1000);  // 1 second delay (1000ms)
	}
</script>

<div class="w-full">
  <textarea
		class="w-full p-4 border border-gray-300 rounded text-black"
		placeholder={placeholder}
		bind:value={$promptC}
		rows="2"
		on:focus={handleFocus}
		on:focusout={handleFocusOut}
	></textarea>
</div>