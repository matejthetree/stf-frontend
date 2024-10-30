import { writable, get } from 'svelte/store';

// The existing stores...
export const started = writable(false);
export const isRecording = writable(false);
export const token = writable('default');
export const aiStrength = writable(0.8);
export const inference_steps = writable(8);
export const guidance_scale = writable(2);
export const control_guidance_start = writable(0);
export const control_guidance_end = writable(1);
export const promptC = writable("");
export const promptEditing = writable(false);  // Tracks if the prompt is active (focused)


// The callback that WebCam.svelte calls to record the frame
export const recordFrame = writable<(blob: Blob) => void>(() => {});

let previousFrame: Blob | null = null;
// This function handles sending frames to the API
function sendFrameToApi(blob: Blob) {
	previousFrame = blob;
	const apiUrl = `/recorder/image/`;

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
export function sendParamsToApi() {
	const apiUrl = `recorder/params/`;

	const formData = new FormData();
	formData.append('token', get(token));
	formData.append('prompt', get(promptC));
	formData.append('ais', get(aiStrength).toString());
	formData.append('inference_steps', get(inference_steps).toString());
	formData.append('guidance_scale', get(guidance_scale).toString());
	formData.append('control_guidance_start', get(control_guidance_start).toString());
	formData.append('control_guidance_end', get(control_guidance_end).toString());

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
		if (previousFrame) {
			console.log("sending last frame")
			sendFrameToApi(previousFrame);
		}
		recordFrame.set(() => {});
	}
});




