import type { DiffusionInterface } from './diffusion.interface';
import {
	EControlMode,
	EPreProcessorGroup,
	type ITextToImage,
	RunwareServer
} from '@runware/sdk-js';

class Runway implements DiffusionInterface {
	runway = new RunwareServer({ apiKey: 'Jv5YwafgXDwSygDEb6OrGycH2qAvvL8l' });

	async processImage(prompt: string, image: string, quality: number): Promise<string> {
		await this.runway.ensureConnection();
		const preproc = await this.runway.controlNetPreProcess({
			inputImage: image,
			height: 512,
			width: 512,
			outputType: 'base64Data',
			preProcessor: EPreProcessorGroup.depth,

		});

		const result: ITextToImage[] | undefined = await this.runway.requestImages({
			outputType: 'base64Data',
			positivePrompt: 'beautiful, 4k, amazing, architecture, glass structures, windows, ',
			model: 'civitai:25694@143906',
			seedImage: preproc?.guideImageBase64Data,
			height: 512,
			width: 512,
			checkNsfw: true,
			strength: 0.9,
		});

		if (result) {
			return result[0].imageBase64Data!;
		} else {
			console.log('no result');
			return '';
		}
	}

	enhanceImage(image: string): Promise<string> {
		throw new Error('Method not implemented.');
	}
}

export const diffusion: DiffusionInterface = new Runway();
