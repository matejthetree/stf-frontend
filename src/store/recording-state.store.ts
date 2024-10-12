import { writable } from 'svelte/store';

export const localCamera = writable(false);  // Controls the webcam state
export const token = writable("default");
export const aiStrength = writable(0.5);    // Example for AI strength
export const prompt = writable("default prompt");  // Example for prompt