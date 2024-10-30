export interface DiffusionInterface {
	processImage(prompt: string, image: string, quality: number): Promise<string>;

	processParams(prompt: string, ais: number, inference_steps?: number, guidance_scale?: number, control_guidance_start?: number, control_guidance_end?: number): Promise<void>;

	enhanceImage(image: string): Promise<string>;
}
