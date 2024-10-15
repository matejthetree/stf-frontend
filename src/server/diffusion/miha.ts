import axios from 'axios';
import FormData from 'form-data';
import * as https from 'node:https';
import type { DiffusionInterface } from './diffusion.interface';

class Miha implements DiffusionInterface {
	private readonly baseURL: string = 'http://20.172.32.213:8080/process'; // Update with your actual base URL

	// Implement the processImage method
	async processImage(prompt: string, image64: string, quality: number): Promise<string> {

		try {
			// Convert base64 image to a buffer or file if needed
			const imageBuffer = Buffer.from(image64, 'base64');

			// Create a form and append the image file
			const form = new FormData();
			form.append('file', imageBuffer, {
				filename: 'image.jpg',
				contentType: 'image/jpeg'
			});

			// Make the POST request to the Python backend
			const response = await axios.post(this.baseURL, form, {
				headers: {
					...form.getHeaders()
				},
				responseType: 'arraybuffer', // Important: This will allow receiving the image as binary data
				httpsAgent: new https.Agent({
					rejectUnauthorized: false // Ignore SSL certificate validation (optional for self-signed certs)
				}),
				timeout: 60000 // 60 seconds timeout as per the Python example
			});

			if (response.status !== 200) {
				throw new Error(`Failed to process image: ${response.statusText}`);
			}

			// Convert the binary image data to base64 and return it
			const base64Image = Buffer.from(response.data, 'binary').toString('base64');
			return `data:image/jpeg;base64,${base64Image}`; // Return the base64 image with the correct data URL format
		} catch (error) {
			// @ts-ignore
			console.error('Error processing image:', error.message);
			throw new Error('Internal server error during image processing.');
		}
	}

	async processParams(prompt: string, ais: number) :Promise<void> {
		console.log('processing params', prompt, ais);
		try {
			// Example usage
			const settings = {
				prompt: 'architecture' + prompt,
				negative_prompt: "human, body, face, low quality, medium quality, nudity, nsfw, naked, porn, person ",
				seed: 12345,
				inference_steps: 8,
				noise_strength: 0.5,
				conditioning_scale: 1-ais*0.99
			};

			const response = await axios.post('http://20.172.32.213:8080/settings', settings, {
				headers: {
					'Content-Type': 'application/json' // Specify content type for JSON payload
				}
			});

			if (response.status === 200) {
				console.log('Settings updated successfully:', response.data);
			} else {
				console.error('Failed to update settings. Status:', response.status);
			}
		} catch (error) {
			// @ts-ignore
			console.error('Error updating settings:', error.message);
		}
	}

	// Implement the enhanceImage method
	async enhanceImage(image: string): Promise<string> {
		throw new Error('Method not implemented.');
	}
}

// Export the Miha instance as DiffusionInterface
export const diffusion: DiffusionInterface = new Miha();
