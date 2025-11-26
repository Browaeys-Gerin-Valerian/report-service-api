import { templateDbService } from "./template.db.service";
import { writeTemplateFileOrRollback } from "../utils/templates.utils";
import { ITemplate } from "../interfaces";
import { detectFormat } from "../utils/functions.utils";

export const templateFilesystemService = {
    createOne,
};


export async function createOne(payload: ITemplate, file: Express.Multer.File) {
    const format = detectFormat(file);
    const doc = await templateDbService.createOne({ ...payload, format });

    // if doc creation failed for some reason, file should not be written
    if (!doc) {
        throw new Error("Failed to create template in database");
    }
    return await writeTemplateFileOrRollback(doc, file);
}
