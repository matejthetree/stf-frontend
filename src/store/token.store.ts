import { writable } from 'svelte/store';

export let isConnectedTokenValid = writable(true);  // To track connection status
