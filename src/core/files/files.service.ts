import { promises } from "fs";
import { dirname, isAbsolute, join } from "path";

export class FileService {

    private async isExist(path: string) {
        try {
            await promises.stat(path);
            return true;
        } catch (_) {
            return false;
        }
    }

    public getFilePath(path: string, name: string, ext: string): string {
        if (!isAbsolute(path)) {
            path = join(__dirname, path);
        }
        return join(dirname(path), name + '.' + ext);
    }

    public async deleteFileIfExist(path: string) {
        if (await this.isExist(path)) {
            promises.unlink(path);
        }
    }
}