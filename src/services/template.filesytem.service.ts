import { templateDbService } from "./template.db.service";
import { generateFileName, saveUploadedFile } from "../utils/templates.utils";

export const templateFilesystemService = {
    createOne,
};


export async function createOne(data: any, file: Express.Multer.File) {

    // 1. Create DB entry
    const doc = await templateDbService.createOne({ ...data, });

    // 2. Compute final name
    const finalName = generateFileName(doc._id.toString());

    // 3. Move file to final name
    saveUploadedFile(file.path, finalName);
}
