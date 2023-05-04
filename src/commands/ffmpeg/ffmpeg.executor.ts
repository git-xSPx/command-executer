import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { CommandExecutor } from "../../core/executor/command.executor";
import { ICommandExec } from "../../core/executor/command.types";
import { IStreamLogger } from "../../core/handlers/stream-logger.interface";
import { ICommandExecFfmpeg, IFfmpegInput } from "./ffmpeg.types";
import { PromptService } from "../../core/prompt/prompt.service";
import { FfmpegBuilder } from "./ffmpeg.builder";
import { FileService } from "../../core/files/files.service";
import { StreamHandler } from "../../core/handlers/stream.handler";

export class FfmpegExecutor extends CommandExecutor<IFfmpegInput> {
    private promptService: PromptService = new PromptService();
    private fileService: FileService = new FileService();

    constructor(logger: IStreamLogger) {
        super(logger);
    }

    protected async promt(): Promise<IFfmpegInput> {
        const inputPath = await this.promptService.input<string>('Enter input file name: ', 'input');
        const width = await this.promptService.input<number>('Enter video width: ', 'number');
        const height = await this.promptService.input<number>('Enter video height: ', 'number');
        const outputFileName = await this.promptService.input<string>('Enter outinput file name: ', 'input');
        return { inputPath, width, height, outputFileName };
    }

    protected build({ inputPath, width, height, outputFileName }: IFfmpegInput): ICommandExecFfmpeg {
        const outputPath = this.fileService.getFilePath(inputPath, outputFileName, 'mp4');
        const args = (new FfmpegBuilder())
            .input(inputPath)
            .setVideoSize(width, height)
            .output(outputPath);
        return { command: 'ffmpeg', args, outputPath };
    }

    protected spawn({ command, args, outputPath }: ICommandExecFfmpeg): ChildProcessWithoutNullStreams {
        this.fileService.deleteFileIfExist(outputPath);
        return spawn(command, args);
    }
    
    protected processStream(stream: ChildProcessWithoutNullStreams, logger: IStreamLogger): void {
        const streamHandler = new StreamHandler(logger);
        streamHandler.processOutput(stream);
    }
}