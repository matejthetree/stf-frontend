import { error } from '@sveltejs/kit';
import { verifyToken } from '../../../server/qr-manager';

/** @type {import('../../../.svelte-kit/types/src/routes').PageLoad} */
export function load({ params }) {
	const token = params.token;
	if (token) {
		if (verifyToken(token)) {
			return { token };
		}
		return error(404, 'Wrong token');
	} else {
		return error(404, 'Not found');
	}
}
