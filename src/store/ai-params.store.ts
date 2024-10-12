import { writable, get } from 'svelte/store';

// The existing stores...
export const started = writable(false);
export const isRecording = writable(false);
export const token = writable('default');
export const aiStrength = writable(0.8);
export const promptC = writable("Architecture, city, sunshine, day, urban landscape, skyscrapers, scenery, white clouds, buildings, bridges, sky, city lights, blue sky, east_ Asia_ Architecture, mountains, rivers, pagodas, outdoor, trees, tokyo_\\\\ (City )<lora:20_a:0.2>");

export let subscription = false;
// The callback that WebCam.svelte calls to record the frame
export const recordFrame = writable<(blob: Blob) => void>(() => {});

// This function handles sending frames to the API
function sendFrameToApi(blob: Blob) {
	const apiUrl = `0.0.0.0:4173/recorder/image/`;

	const formData = new FormData();
	formData.append('token', get(token));
	formData.append('frame', blob, 'frame.jpg');

	fetch(apiUrl, {
		method: 'POST',
		body: formData,
	})
		.then(response => {
			if (!response.ok) {
				console.error('Error sending frame:', response.statusText);
			}
		})
		.catch(err => console.error('Error sending frame', err));
}

// This function handles sending updated params (prompt, ais) to the API
function sendParamsToApi() {
	const apiUrl = `0.0.0.0:4173/recorder/params/`;

	const formData = new FormData();
	formData.append('token', get(token));
	formData.append('prompt', get(promptC));
	formData.append('ais', get(aiStrength).toString());

	fetch(apiUrl, {
		method: 'POST',
		body: formData,
	})
		.then(response => {
			if (!response.ok) {
				console.error('Error sending params:', response.statusText);
			}
		})
		.catch(err => console.error('Error sending params', err));
}

// Subscribe to isRecording and set the callback function
isRecording.subscribe((recording) => {
	if (recording) {
		recordFrame.set((blob: Blob) => sendFrameToApi(blob));
	} else {
		recordFrame.set(() => {});
	}
});


export function subscribe() {

	subscription = true;
	// // Subscribe to prompt and aiStrength and send updates to the API
	promptC.subscribe(() => {
		sendParamsToApi();
	});
	//
	aiStrength.subscribe(() => {
		sendParamsToApi();
	});

}