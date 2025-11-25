import { templateDbService } from "./template.db.service";
import { generateFileName, saveUploadedFile } from "../utils/templates.utils";
import { ITemplate } from "../interfaces";

export const templateFilesystemService = {
    createOne,
};


export async function createOne(templateToCreate: ITemplate, file: Express.Multer.File) {
    const doc = await templateDbService.createOne({ ...templateToCreate, });
    const finalName = generateFileName(doc);
    saveUploadedFile(file.path, finalName);
    return doc;
}
