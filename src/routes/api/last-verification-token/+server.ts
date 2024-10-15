import { json } from '@sveltejs/kit';
import { lastVerification } from '../../../server/qr-manager'; // Assuming verifyToken is in this file

export async function GET() {
	// Return the verification result
	return json({ lastVerification });
}
