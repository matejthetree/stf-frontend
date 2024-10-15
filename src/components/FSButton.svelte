<script>
	import Fa from 'svelte-fa';
	import { faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';

	let isFullScreen = false;

	function goFullScreen() {
		if (!isFullScreen) {
			enterFullScreen();
		} else {
			exitFullScreen();
		}
	}

	function enterFullScreen() {
		const elem = document.documentElement;
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		}
		isFullScreen = true;
	}

	function exitFullScreen() {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		}
		isFullScreen = false;
	}

	function onFullScreenChange() {
		isFullScreen = !!(
			document.fullscreenElement
		);
	}

	document.addEventListener('fullscreenchange', onFullScreenChange);
	document.addEventListener('webkitfullscreenchange', onFullScreenChange);
	document.addEventListener('msfullscreenchange', onFullScreenChange);
</script>

<button
	on:click={goFullScreen}
	class="absolute top-8 left-8 text-white p-2"
	aria-label={isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
>
	{#if isFullScreen}
		<Fa icon={faCompress} class="w-6 h-6" />
	{:else}
		<Fa icon={faExpand} class="w-6 h-6" />
	{/if}
</button>