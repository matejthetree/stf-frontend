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

export async function updateParams(prompt: string, ais: number, inference_steps?: number, guidance_scale?: number, control_guidance_start?: number, control_guidance_end?: number) {
	console.log('update params', prompt, ais, inference_steps, guidance_scale, control_guidance_start, control_guidance_end);
	lastAis = ais;
	lastPrompt = prompt;

	
	if(inference_steps || guidance_scale || control_guidance_start || control_guidance_end) {
		await diffusion.processParams(prompt, ais, inference_steps, guidance_scale, control_guidance_start, control_guidance_end);
	}
	else{
		await diffusion.processParams(prompt, ais);
	}

	if (lastImgP != '') {
		return processImage(lastImgP);
	}
}
