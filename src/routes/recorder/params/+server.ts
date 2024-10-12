import { json } from '@sveltejs/kit';
import { updateParams } from '../../../server/image-processor';
import { verifyToken } from '../../../server/qr-manager';

export async function POST({ request }) {

	// Extract the image from the formData

	const formData = await request.formData();
	const token = formData.get('token') as string; // Prompt is a string
	const prompt = formData.get('prompt') as string; // Prompt is a string
	const ais = Number(formData.get('ais')); // Convert ais to a number
	console.log("sending params to api", token, prompt, ais)

	if (!verifyToken(token)) {
		console.log("invalid tokens")
		return json({ message: 'Invalid token' }, { status: 400 });
	}

	console.log('record received', prompt, ais);
	if (!ais && !prompt) {
		return json({ message: 'No params received' }, { status: 400 });
	}

	// Call your image processing module
	const result = await updateParams(prompt, ais);

	return json({ message: 'Image processed successfully', result }, { status: 200 });
}