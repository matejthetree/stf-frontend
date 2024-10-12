import { json } from '@sveltejs/kit';
import { verifyToken } from '../../../server/qr-manager'; // Assuming verifyToken is in this file

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export async function GET({ url }) {
	// Get the token from the query parameters
	const token = url.searchParams.get('token');

	// If the token is missing, return an error
	if (!token) {
		return json({ valid: false, message: 'Token missing' }, { status: 400 });
	}

	// Verify the token using your logic
	const isValid = verifyToken(token);

	// Return the verification result
	if (isValid) {
		return json({ valid: true });
	} else {
		return json({ valid: false, message: 'Invalid or expired token' }, { status: 400 });
	}
}
