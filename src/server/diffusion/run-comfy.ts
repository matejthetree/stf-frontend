import type { DiffusionInterface } from './diffusion.interface';
import axios from 'axios';
import FormData from 'form-data';

import { ComfyApi } from '@saintno/comfyui-sdk';
import * as https from 'node:https';
import * as fs from 'node:fs';

const url = '/api/upload/image';


class RunComfy implements DiffusionInterface {
	private promptTemplate: any;

	// Implement the processImage method
	// @ts-ignore
	async processImage(prompt: string, image64: string, quality: number): Promise<string> {
		// Ignore SSL certificate validation for demo purposes (for self-signed certificates)
		const httpsAgent = new https.Agent({
			rejectUnauthorized: false
		});

		// Create a FormData instance to handle binary data and JSON data
		// Create a FormData instance
		const formData = new FormData();
		formData.append('image', image64);  // Append the binary file

// Set the headers based on the provided request
		const headers = {
			'Accept': '*/*',
			'Accept-Encoding': 'gzip, deflate, br, zstd',
			'Accept-Language': 'en-US,en',
			'Cache-Control': 'max-age=0',
			'Comfy-User': 'undefined',  // Custom header
			'Connection': 'keep-alive',
			'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,  // Automatically set by formData.getHeaders()
			'Host': '20.172.32.213:8080',
			'Origin': 'https://20.172.32.213:8080',
			'Referer': 'https://20.172.32.213:8080/',  // Provided referer
			'Sec-Ch-Ua': '"Brave";v="129", "Not-A?Brand";v="8", "Chromium";v="129"',
			'Sec-Ch-Ua-Platform': '"macOS"',
			'Sec-Fetch-Dest': 'empty',
			'Sec-Fetch-Mode': 'cors',
			'Sec-Fetch-Site': 'same-origin',
			'Sec-Gpc': '1',
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
		};

// Send the POST request
		await axios.post('http://20.172.32.213:8080/api/upload/image', formData, {
			headers: {
				...headers,
				...formData.getHeaders()  // Ensure FormData-specific headers are included
			},
			httpsAgent // Attach the custom HTTPS agent to handle SSL certificate issues
		})

		console.log("finished upload")
	}

	enhanceImage(image: string): Promise<string> {
		throw new Error('Method not implemented.');
	}
}

// Export the RunComfy instance as DiffusionInterface
export const diffusion: DiffusionInterface = new RunComfy();
