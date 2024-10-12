import type { DiffusionInterface } from './diffusion.interface';
import {
	type IEnhancedPrompt,
	type ITextToImage,
	RunwareServer
} from '@runware/sdk-js';

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

		// const positivePrompt = await this.enhancePrompt(
		// 	'beautiful, 4k, upscale, photorealism, ' + prompt
		// );
		const positivePrompt = '' + prompt;
		console.log("processing prompt", positivePrompt);
		const result: ITextToImage[] | undefined = await this.runway.requestImages({
			outputType: 'base64Data',
			positivePrompt: positivePrompt,
			model: 'civitai:618692@691639',
			seedImage: image,

			// negativePrompt:"bad quality, foggy, shady",
			// controlNet: {
			// 	model: 'runware:9@1',
			// 	guideImage: image,
			// },
			lora:{
				model:"civitai:786131@879110",
				weight: 0.7
			},
			height: 512,
			width: 512,
			strength: ais
		});

		if (result && !result[0].NSFWContent) {
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
