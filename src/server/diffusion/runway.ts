import type { DiffusionInterface } from './diffusion.interface';
import {
	EPreProcessorGroup,
	type IEnhancedPrompt,
	type IImageToText,
	type ITextToImage,
	RunwareServer
} from '@runware/sdk-js';
import { run } from 'node:test';

class Runway implements DiffusionInterface {
	runway = new RunwareServer({ apiKey: 'Jv5YwafgXDwSygDEb6OrGycH2qAvvL8l' });

	async processImage(prompt: string, image: string, ais: number): Promise<string> {
		await this.runway.ensureConnection();
		// const preproc = await this.runway.controlNetPreProcess({
		// 	inputImage: image,
		// 	height: 512,
		// 	width: 512,
		// 	outputType: 'base64Data',
		// 	preProcessor: EPreProcessorGroup.depth,
		//
		// });

		const positivePrompt = await this.enhancePrompt(
			'beautiful, 4k, upscale, photorealism, ' + prompt
		);
		const result: ITextToImage[] | undefined = await this.runway.requestImages({
			outputType: 'base64Data',
			positivePrompt: positivePrompt,
			model: 'civitai:25694@143906',
			seedImage: image,
			height: 512,
			width: 512,
			checkNsfw: true,
			strength: ais
		});

		if (result) {
			return result[0].imageBase64Data!;
		} else {
			console.log('no result');
			return '';
		}
	}

	async enhanceImage(image: string): Promise<string> {
		await this.runway.ensureConnection();
		const response = await this.runway.upscaleGan({
			inputImage: image,
			upscaleFactor: 2,
			outputType: 'base64Data'
		});
		return response.imageBase64Data!;
	}

	async enhancePrompt(prompt: string): Promise<string> {
		await this.runway.ensureConnection();
		const enhanced: IEnhancedPrompt[] = await this.runway.enhancePrompt({ prompt });
		return enhanced[0].text;
	}
}

export const diffusion: DiffusionInterface = new Runway();
