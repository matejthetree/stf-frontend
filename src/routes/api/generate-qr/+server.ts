// @ts-ignore
import { v4 as uuidv4 } from 'uuid'; // For unique token generation
// @ts-ignore
import QRCode from 'qrcode'; // To generate the QR code
import { json } from '@sveltejs/kit';

// Function to convert a UUID to a URL-safe Base64 string
function convertToBase64UrlSafe(uuid: string): string {
	// Convert the UUID to a standard Base64 string
	const base64 = Buffer.from(uuid).toString('base64');

	// Make the Base64 string URL-safe by replacing +, /, and trimming =
	return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function GET() {
	const token = uuidv4(); // Generate a unique token
	const tokenUrlSafe = convertToBase64UrlSafe(token); // Convert to URL-safe Base64

	const url = `https://localhost:5173/recorder/${tokenUrlSafe}`; // Generate the URL for the QR code

	try {
		const qrCodeDataUrl = await QRCode.toDataURL(url); // Generate the QR code as a Data URL
		return json({ token: tokenUrlSafe, qrCodeDataUrl, url }); // Return the token and QR code as JSON
	} catch (err) {
		return json({ error: 'Failed to generate QR code' }, { status: 500 });
	}
}