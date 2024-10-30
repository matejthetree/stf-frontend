import { json } from '@sveltejs/kit';
import { updateParams } from '../../../server/image-processor';
import { verifyToken } from '../../../server/qr-manager';

export async function POST({ request }) {

	// Extract the image from the formData

	const formData = await request.formData();
	const token = formData.get('token') as string; // Prompt is a string
	const prompt = formData.get('prompt') as string; // Prompt is a string
	const ais = Number(formData.get('ais')); // Convert ais to a number
	const inference_steps = Number(formData.get('inference_steps')); // Convert inference_steps to a number
	const guidance_scale = Number(formData.get('guidance_scale')); // Convert guidance_scale to a number
	const control_guidance_start = Number(formData.get('control_guidance_start')); // Convert control_guidance_start to a number
	const control_guidance_end = Number(formData.get('control_guidance_end')); // Convert control_guidance_end to a number
	console.log("sending params to api", token, prompt, ais, inference_steps, guidance_scale, control_guidance_start, control_guidance_end);

	if (!verifyToken(token)) {
		console.log("invalid tokens")
		return json({ message: 'Invalid token' }, { status: 400 });
	}

	console.log('params update received', prompt, ais);
	if (!ais && !prompt) {
		return json({ message: 'No params received' }, { status: 400 });
	}

	// Call your image processing module
	const result = await updateParams(prompt, ais, inference_steps, guidance_scale, control_guidance_start, control_guidance_end);

	return json({ message: 'Image processed successfully', result }, { status: 200 });
}