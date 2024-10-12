import { json } from '@sveltejs/kit';
import { processImage } from '../../../server/image-processor';
import { verifyToken } from '../../../server/qr-manager';

export async function POST({ request }) {
	// Extract the image from the formData
	const formData = await request.formData();
	const token = formData.get('token') as string; // Prompt is a string
	const file = formData.get('frame') as Blob;

	console.log('post image called', token);
	if (!verifyToken(token)) {
		return json({ message: 'Invalid token' }, { status: 400 });
	}

	if (!file) {
		return json({ message: 'No image received' }, { status: 400 });
	}

	// Convert the Blob to a base64 string
	const buffer = await file.arrayBuffer();
	const base64Image = Buffer.from(buffer).toString('base64');

	// Call your image processing module
	const result = await processImage(base64Image);

	return json({ message: 'Image processed successfully', result }, { status: 200 });
}
