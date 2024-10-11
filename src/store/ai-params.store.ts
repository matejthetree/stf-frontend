import { writable } from 'svelte/store';

// Create the shared writable stores
export const aiStrength = writable(0);        // Store for AI strength
export const prompt = writable('');           // Store for user prompt
export const started = writable(false);       // Store for start/stop state

// Subscribe to changes in the stores
aiStrength.subscribe((value) => {
	console.log("aistrenght changed", value);
});

prompt.subscribe((value) => {
	console.log("prompt", value);
});

started.subscribe((value) => {
	console.log("started", value);
});

