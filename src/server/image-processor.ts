import { diffusion } from './diffusion/runway';

export let lastPrompt = 'architecture';
export let lastImg = '';
let lastImgPrompt = '';
export let lastAis = 0.8;

export async function processImage(base64Image: string): Promise<string | false> {
	console.log('Processing image...', lastAis, lastPrompt);
	if (base64Image == lastImgPrompt) {
		console.log('not processing the same image');
		return false;
	}
	lastImgPrompt = base64Image;
	if (base64Image == '') {
		console.log('setting empty image', lastImg);
		return false;
	}
	const processed = await diffusion.processImage(lastPrompt, base64Image, lastAis);
	lastImg = processed;
	return processed;
}

export async function updateParams(prompt: string, ais: number) {
	console.log('update params', prompt, ais);
	lastAis = ais;
	lastPrompt = prompt;

	if (lastImg != '') {
		return processImage(lastImg);
	}
}
