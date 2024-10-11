import type { DiffusionInterface } from './diffusion.interface';
import axios from 'axios';
import FormData from 'form-data';
import { promises as fs } from 'fs';
import path from 'path';

import { ComfyApi } from '@saintno/comfyui-sdk';
import json from '../../../assets/comfy/lora-sd-1.5.json'

const url = '/api/upload/image';

const api = new ComfyApi(
	'https://02f182c7-c099-4f43-81f1-03918cc42718-comfyui.runcomfy.com',
	'undefined'
);
api.on('log', (ev) => console.log(ev.detail)); // Debug logs
await api
	.init(1000, 1000) // Initialize websocket
	.waitForReady(); // Wait for the client to be ready


class RunComfy implements DiffusionInterface {
	private promptTemplate: any;


	// Implement the processImage method
	async processImage(prompt: string, image64: string, quality: number): Promise<string> {
		// Ensure the promptTemplate is loaded
		if (!this.promptTemplate) {
			throw new Error('Prompt template not loaded');
		}

		// Modify the prompt based on input
		this.promptTemplate['6']['inputs']['text'] = prompt;
		this.promptTemplate['3']['inputs']['seed'] = 0; // Random seed for each generation

		// Prepare the form data to send image and other details
		const formData = new FormData();
		formData.append('prompt', JSON.stringify(this.promptTemplate));
		formData.append('image', image64); // Base64 image string
		formData.append('quality', quality.toString());

		try {
			const response = await axios.post(url, formData, {
				headers: {
					...formData.getHeaders()
				}
			});

			if (response.status === 200) {
				return response.data.imageBase64; // Processed image in base64
			} else {
				throw new Error(`Failed to process image. Status code: ${response.status}`);
			}
		} catch (error) {
			console.error('Error processing image:', error);
			throw new Error('An error occurred while processing the image.');
		}
	}

	enhanceImage(image: string): Promise<string> {
		throw new Error('Method not implemented.');
	}
}

// Export the RunComfy instance as DiffusionInterface
export const diffusion: DiffusionInterface = new RunComfy();
