export class FfmpegBuilder {
    private inputPath: string;
    private options: Map<string, string> = new Map();

    constructor() {
        this.options.set('-c:v', 'libx264');
    }

    public input(inputPath: string): this {
        this.inputPath = inputPath;
        return this;
    }

    public setVideoSize(width: number, height: number): this {
        
        if (width <= 0) {
            throw new Error('Width must be grater then 0!')
        }
        
        if (height <= 0) {
            throw new Error('Height must be grater then 0!')
        }
        
        this.options.set('-s', `${width}x${height}`);
        return this;

    }
    
    public output(outputPath: string): string[] {
        
        if(!this.inputPath) {
            throw new Error('Input path undefined!');
        }
        
        const args: string[] = ['-i', this.inputPath];
        
        this.options.forEach((value, key) => {
            args.push(key);
            args.push(value);
        });

        args.push(outputPath);

        return args;
    }

}