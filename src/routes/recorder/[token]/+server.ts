import { json } from '@sveltejs/kit';
import { processImage } from '../../../server/image-processor';

export async function POST({ request }) {
	// Extract the image from the formData
	const formData = await request.formData();
	const file = formData.get('frame') as Blob;

	if (!file) {
		return json({ message: 'No image received' }, { status: 400 });
	}

	// Convert the Blob to a base64 string (to simulate processing)
	const buffer = await file.arrayBuffer();
	const base64Image = Buffer.from(buffer).toString('base64');

	// Call your image processing module
	const result = await processImage(base64Image);

	//notify subscribers
	notifyClients(result)

	return json({ message: 'Image processed successfully', result }, { status: 200 });
}

let clients: any[] = [];

export function GET({ request }) {
	const headers = new Headers({
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		Connection: 'keep-alive'
	});

	const stream = new ReadableStream({
		start(controller) {
			const client = { controller };
			clients.push(client);

			request.signal.addEventListener('abort', () => {
				clients = clients.filter((c) => c !== client);
				controller.close();
			});
		}
	});

	return new Response(stream, { headers });
}

// Function to send data to all SSE clients (you call this from the POST endpoint)
function notifyClients(data: any) {
	clients.forEach((client) => {
		if (client.controller.closed) {
			return;
		}
		client.controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
	});
}
