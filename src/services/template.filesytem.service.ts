import { templateDbService } from "./template.db.service";
import { generateFileName, handleTemplateNameAndFileChange, handleTemplateFileUpdateOnly, handleTemplateNameUpdateOnly, handleWriteTemplateFile } from "../utils/templates.utils";
import { ITemplate } from "../interfaces";
import { detectFormat, isNotEmptyObject } from "../utils/functions.utils";

export const templateFilesystemService = {
    createOne,
    updateOne
};


export async function createOne(payload: ITemplate, file: Express.Multer.File) {
    const filename = generateFileName(payload, file);
    const format = detectFormat(file);
    const doc = await templateDbService.createOne({ ...payload, format, filename });

    // if doc creation failed for some reason, file should not be written
    if (!doc) {
        throw new Error("Failed to create template in database");
    }
    return await handleWriteTemplateFile(doc, file);
}

export async function updateOne(id: string, payload: Partial<ITemplate>, file?: Express.Multer.File) {

    const docToUpdate = await templateDbService.getOneById(id);

    if (!docToUpdate) {
        throw new Error("Template not found");
    }

    const fileExist = file && isNotEmptyObject(file)

    //case where neither name nor file are changed just other metadata
    if (!payload?.name && !fileExist) {
        return await templateDbService.updateOne(id, payload);
    }

    //case where only name is changed but file remains the same
    if (payload?.name && !fileExist) {
        return handleTemplateNameUpdateOnly(docToUpdate, id, payload);
    }

    //case where only file is changed
    if (!payload?.name && fileExist) {
        return handleTemplateFileUpdateOnly(docToUpdate, id, file);
    }

    //case where both name and file are changed
    return handleTemplateNameAndFileChange(docToUpdate, id, payload, file!);

}