<script>
	import Screens from '../components/Screens.svelte';
	import Prompt from '../components/Prompt.svelte';
	import StartStop from '../components/StartStop.svelte';
	import AIStrength from '../components/AIStrength.svelte';

</script>

<Screens></Screens>
<!-- Prompt Component Below the Boxes -->
<div class="w-full mt-4 p-6">
	<Prompt />
</div>

<!-- Slider and Start/Stop Button Layout -->
<div class="flex justify-between items-center mt-4 p-6">
	<!-- Slider on the left -->
	<div class="w-4/5">
		<AIStrength></AIStrength>
	</div>

	<!-- Start/Stop Buttons on the right -->
	<div class="space-x-4 px-12 pb-2">
		<StartStop></StartStop>
	</div>
</div>