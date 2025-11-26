import fs from "fs";
import path from "path";
import { templateDbService } from "./template.db.service";
import { deleteTemplateFile, generateFileName, updateTemplateFile, writeTemplateFileOrRollback } from "../utils/templates.utils";
import { ITemplate } from "../interfaces";
import { detectFormat } from "../utils/functions.utils";
import { config } from "../config";
const { TEMPLATE_DIR } = config;

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
    return await writeTemplateFileOrRollback(doc, file);
}

export async function updateOne(id: string, payload: Partial<ITemplate>, file?: Express.Multer.File) {

    const docToUpdate = await templateDbService.getOneById(id);

    if (!docToUpdate) {
        throw new Error("Template not found");
    }

    //case where only name is changed but file remains the same
    if (payload.name && !file) {
        // If only the name is updated in json, we need to rename the file in the filesystem and update the filename in DB
        //we can't use generateFileName here because the user didn't upload a new file
        const filename = `${payload.name}-${Date.now()}.${docToUpdate.format}`;
        await templateDbService.updateOne(id, { ...payload, filename });

        const finalPathOld = path.join(TEMPLATE_DIR, docToUpdate.filename);
        const finalPathNew = path.join(TEMPLATE_DIR, filename);
        if (fs.existsSync(finalPathOld)) {
            fs.renameSync(finalPathOld, finalPathNew);
        }
    }

    //case where only file is changed
    if (!payload.name && file) {
        const filename = generateFileName(docToUpdate, file);
        await deleteTemplateFile(docToUpdate);
        const updatedDoc = await templateDbService.updateOne(id, { filename, format: detectFormat(file) });
        if (!updatedDoc) {
            throw new Error("Failed to update template in database");
        }
        await writeTemplateFileOrRollback(updatedDoc, file);
    }


    //case where both name and file are changed
    if (payload.name && file) {
        const filename = generateFileName(docToUpdate, file);
        await deleteTemplateFile(docToUpdate);

        const updatedDoc = await templateDbService.updateOne(id, { ...payload, filename, format: detectFormat(file) });
        if (!updatedDoc) {
            throw new Error("Failed to update template in database");
        }
        await writeTemplateFileOrRollback(updatedDoc, file);
    }

}