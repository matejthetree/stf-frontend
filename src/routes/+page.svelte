<script>
	import Screens  from '../components/screens.svelte';
	import Prompt from '../components/prompt.svelte';
	import StartStop from '../components/start-stop.svelte';
	import AIStrength from '../components/aistrength.svelte';
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