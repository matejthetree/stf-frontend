<script lang="ts">
	import { promptC } from '../store/ai-params.store';  // Import the shared store

	export let placeholder = "Enter your prompt here...";
</script>

<div class="w-full">
  <textarea
		class="w-full p-4 border border-gray-300 rounded text-black"
		placeholder={placeholder}
		bind:value={$promptC}
		rows="3"
	></textarea>
</div>