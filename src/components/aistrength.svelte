<script lang="ts">
	import { RangeSlider } from '@skeletonlabs/skeleton';

	let value = 100; // Declare the value variable
</script>

<RangeSlider bind:value={value} min={0} max={100} step={1} name="RangeSlider">
	<span slot="trail">
		<p>AI Strength: {value}</p>
	</span>
</RangeSlider>