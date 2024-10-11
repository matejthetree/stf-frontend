export interface DiffusionInterface {
	processImage(prompt: string, image: string, quality: number): Promise<string>;

	enhanceImage(image: string): Promise<string>;
}
