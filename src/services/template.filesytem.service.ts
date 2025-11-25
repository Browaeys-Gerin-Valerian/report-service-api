import { templateDbService } from "./template.db.service";
import { generateFileName, saveUploadedFile } from "../utils/templates.utils";

export const templateFilesystemService = {
    createOne,
};


export async function createOne(data: any, file: Express.Multer.File) {
    const doc = await templateDbService.createOne({ ...data, });
    const finalName = generateFileName(doc);
    saveUploadedFile(file.path, finalName);
}
