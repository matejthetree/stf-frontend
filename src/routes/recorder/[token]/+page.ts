import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	let token = params.token;
	if (token) {
		return { token };
	} else {
		return error(404, 'Not found');
	}
}
