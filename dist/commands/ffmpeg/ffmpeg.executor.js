"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FfmpegExecutor = void 0;
const child_process_1 = require("child_process");
const command_executor_1 = require("../../core/executor/command.executor");
const prompt_service_1 = require("../../core/prompt/prompt.service");
const ffmpeg_builder_1 = require("./ffmpeg.builder");
const files_service_1 = require("../../core/files/files.service");
const stream_handler_1 = require("../../core/handlers/stream.handler");
class FfmpegExecutor extends command_executor_1.CommandExecutor {
    constructor(logger) {
        super(logger);
        this.promptService = new prompt_service_1.PromptService();
        this.fileService = new files_service_1.FileService();
    }
    promt() {
        return __awaiter(this, void 0, void 0, function* () {
            const inputPath = yield this.promptService.input('Enter input file name: ', 'input');
            const width = yield this.promptService.input('Enter video width: ', 'number');
            const height = yield this.promptService.input('Enter video height: ', 'number');
            const outputFileName = yield this.promptService.input('Enter outinput file name: ', 'input');
            return { inputPath, width, height, outputFileName };
        });
    }
    build({ inputPath, width, height, outputFileName }) {
        const outputPath = this.fileService.getFilePath(inputPath, outputFileName, 'mp4');
        const args = (new ffmpeg_builder_1.FfmpegBuilder())
            .input(inputPath)
            .setVideoSize(width, height)
            .output(outputPath);
        return { command: 'ffmpeg', args, outputPath };
    }
    spawn({ command, args, outputPath }) {
        this.fileService.deleteFileIfExist(outputPath);
        return (0, child_process_1.spawn)(command, args);
    }
    processStream(stream, logger) {
        const streamHandler = new stream_handler_1.StreamHandler(logger);
        streamHandler.processOutput(stream);
    }
}
exports.FfmpegExecutor = FfmpegExecutor;
