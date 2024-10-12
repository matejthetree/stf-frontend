<script lang="ts">
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import { aiStrength } from '../store/ai-params.store';  // Import the shared store

	// Update the aiStrength store when the slider value changes
</script>

<RangeSlider bind:value={$aiStrength} min={0} max={1} step={0.05} name="RangeSlider">
	<span slot="trail">
		<p>AI Strength: {$aiStrength}</p>
	</span>
</RangeSlider>