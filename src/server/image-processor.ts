import { diffusion } from './diffusion/miha';

export let lastPrompt = `Archtiecture, iron, glass, wood`;
export let lastImg = '';
export let lastImgP = '';
export let lastAis = 0.8;

export async function processImage(base64Image: string): Promise<string | false> {
	console.log('Processing image...', lastAis, lastPrompt);
	lastImgP = base64Image;
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

	await diffusion.processParams(prompt, ais);

	if (lastImgP != '') {
		return processImage(lastImgP);
	}
}
