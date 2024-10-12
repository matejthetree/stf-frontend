export interface DiffusionInterface {
	processImage(prompt: string, image: string, quality: number): Promise<string>;

	processParams(prompt: string, ais: number): Promise<void>;

	enhanceImage(image: string): Promise<string>;
}
