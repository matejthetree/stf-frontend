import { diffusion } from './diffusion/miha';

export let lastPrompt = `Architecture, city, sunshine, day, urban landscape, skyscrapers, scenery, white clouds, buildings, bridges, sky, city lights, blue sky, east_ Asia_ Architecture, mountains, rivers, pagodas, outdoor, trees, tokyo_\\\\ (City )<lora:20_a:0.2>`;
export let lastImg = '';
let lastImgPrompt = '';
export let lastAis = 0.8;

export async function processImage(base64Image: string): Promise<string | false> {
	console.log('Processing image...', lastAis, lastPrompt);
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

	await diffusion.processParams(prompt, ais);

	if (lastImgPrompt != '') {
		return processImage(lastImgPrompt);
	}
}
