// src/routes/custom-event/+server.js
import { produce } from 'sveltekit-sse';
import {
	lastAis,
	lastImg,
	lastPrompt,
} from '../../../server/image-processor';

/**
 * @param {number} milliseconds
 * @returns
 */
function delay(milliseconds: number) {
	return new Promise(function run(resolve) {
		setTimeout(resolve, milliseconds);
	});
}

export function POST() {
	return produce(async function start({ emit }) {
		let prevAis,
			prevPrompt,
			prevImage = null;

		while (true) {
			if (prevAis != lastAis || prevPrompt != lastPrompt) {
				prevAis = lastAis;
				prevPrompt = lastPrompt;
				console.log('emit params');
				const { error } = emit('params', JSON.stringify({ lastAis, lastPrompt }));
				if (error) {
					console.error(error);
					return;
				}
			}
			if (prevImage != lastImg) {
				prevImage = lastImg;
				console.log('emit img');
				const { error: error2 } = emit('image', JSON.stringify({ lastImg }));
				if (error2) {
					console.error(error2);
					return;
				}
			}
			await delay(500);
		}
	});
}
