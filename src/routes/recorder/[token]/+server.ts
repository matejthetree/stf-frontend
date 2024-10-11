import { json } from '@sveltejs/kit';

export function POST(...args: any[]) {
	console.log("image received")
	return json(
		{ message: 'Success' }, // You can include any additional data here
		{ status: 200 }          // HTTP status code
	);
}