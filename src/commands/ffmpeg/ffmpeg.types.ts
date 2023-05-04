import { ICommandExec } from "../../core/executor/command.types";

export interface IFfmpegInput {
    inputPath: string;
    width: number;
    height: number;
    outputFileName: string;
}

export interface ICommandExecFfmpeg extends ICommandExec {
    outputPath: string;
}