import { json } from '@sveltejs/kit';
import { processImage } from '../../../server/image-processor';

export async function POST({ request }) {
	// Extract the image from the formData
	const formData = await request.formData();
	const file = formData.get('frame') as Blob;
	const prompt = formData.get('prompt') as string; // Prompt is a string
	const ais = Number(formData.get('ais')); // Convert ais to a number

	console.log('record received', prompt, ais);
	if (!file) {
		return json({ message: 'No image received' }, { status: 400 });
	}

	// Convert the Blob to a base64 string
	const buffer = await file.arrayBuffer();
	const base64Image = Buffer.from(buffer).toString('base64');

	// Call your image processing module
	const result = await processImage(prompt, base64Image, ais);

	// Notify all SSE clients
	notifyClients(result);

	return json({ message: 'Image processed successfully', result }, { status: 200 });
}

// Store for clients connected via SSE
let clients: { controller: ReadableStreamDefaultController }[] = [];

export function GET({ request }) {
	const headers = new Headers({
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		Connection: 'keep-alive',
	});

	const stream = new ReadableStream({
		start(controller) {
			const client = { controller };
			clients.push(client);

			// Handle client disconnect
			request.signal.addEventListener('abort', () => {
				controller.close();
				clients = clients.filter((c) => c !== client);
			});
		},
	});

	return new Response(stream, { headers });
}

// Function to send data to all SSE clients
function notifyClients(data: any) {
	console.log('notify clients');
	clients.forEach((client) => {
		// Check if the stream is still open
		try {
			client.controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
		} catch (e) {
			console.error('Failed to send data to client:', e);
			// Remove the client if the stream is closed or fails
			clients = clients.filter((c) => c !== client);
		}
	});
}