import { writable, get } from 'svelte/store';

// Other existing imports...
export const started = writable(false);
export const isRecording = writable(false);
export const token = writable("default");
export const aiStrength = writable(0.5);
export const prompt = writable("default prompt");

// The callback that WebCam.svelte calls to record the frame
export const recordFrame = writable<(blob: Blob) => void>(() => {});

// This function handles sending frames to the API
function sendFrameToApi(blob: Blob) {
	const apiUrl = `http://localhost:5173/recorder/${get(token)}/`;

	const formData = new FormData();
	formData.append('frame', blob, 'frame.jpg');
	formData.append('prompt', get(prompt));
	formData.append('ais', get(aiStrength).toString());

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

// Subscribe to the isRecording store and update the callback function
isRecording.subscribe((recording) => {
	if (recording) {
		// If recording is active, set the recordFrame callback to send the frame to the API
		recordFrame.set((blob: Blob) => sendFrameToApi(blob));
	} else {
		// If recording is not active, set the callback to a no-op function
		recordFrame.set(() => {});
	}
});