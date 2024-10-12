import { json } from '@sveltejs/kit';
import { updateToken } from '../../../server/qr-manager';


export async function GET() {
	const token = 'default'; // Generate a unique token

	updateToken(token)

	return json({token: token, statusCode:200});
}