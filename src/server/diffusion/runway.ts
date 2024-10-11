import type { DiffusionInterface } from './diffusion.interface';
import { ETaskType, type ITextToImage, RunwareServer } from '@runware/sdk-js';

class Runway implements DiffusionInterface {
	runway = new RunwareServer({ apiKey: 'Jv5YwafgXDwSygDEb6OrGycH2qAvvL8l' });

	async processImage(prompt: string, image: string, quality: number): Promise<string> {
		await this.runway.ensureConnection();
		const result: ITextToImage[] | undefined = await this.runway.requestImages({
			outputType: 'base64Data',
			positivePrompt: 'beautiful, 4k, amazing, ghost in the shell, photorealism',
			model: 'civitai:25694@143906',
			seedImage: image,
			height: 512,
			width: 512,
			checkNsfw: true,
		});

		if (result) {
			return result[0].imageBase64Data!;
		}
	}

	enhanceImage(image: string): Promise<string> {
		throw new Error('Method not implemented.');
	}
}

export const diffusion: DiffusionInterface = new Runway();
