import fs from "fs";
import path from "path";
import { config } from "../config";
import { ITemplate } from "../interfaces";
import { templateDbService } from "../services/template.db.service";
import { detectFormat } from "./functions.utils";
const { TEMPLATE_DIR } = config;

if (!fs.existsSync(TEMPLATE_DIR)) {
    fs.mkdirSync(TEMPLATE_DIR);
}

export function generateFileName(template: ITemplate, file: Express.Multer.File): string {
    const { name } = template;
    return `${name}-${Date.now()}.${detectFormat(file)}`;
}

export async function handleWriteTemplateFile(doc: ITemplate, file: Express.Multer.File): Promise<ITemplate> {
    const finalPath = path.join(TEMPLATE_DIR, doc.filename);
    try {
        fs.writeFileSync(finalPath, file.buffer);
        return doc;
    } catch (err) {
        // Rollback DB entry if filesystem write fails
        await templateDbService.deleteOne(doc._id.toString());
        throw err;
    }
}


export async function HandleDeleteTemplateFile(template: ITemplate): Promise<void> {
    const finalPath = path.join(TEMPLATE_DIR, template.filename);
    if (fs.existsSync(finalPath)) {
        fs.unlinkSync(finalPath);
    }
}

// Helper function to handle name update only scenario on template update
export async function handleTemplateNameUpdateOnly(template: ITemplate, id: string, payload: Partial<ITemplate>) {
    //we can't use generateFileName here because the user didn't upload a new file but only changed the name
    const newFilename = `${payload.name}-${Date.now()}.${template.format}`;
    const oldPath = path.join(TEMPLATE_DIR, template.filename);
    const newPath = path.join(TEMPLATE_DIR, newFilename);

    const updated = await templateDbService.updateOne(id, { ...payload, filename: newFilename });
    if (!updated) throw new Error("Failed to update template in database");

    if (fs.existsSync(oldPath)) fs.renameSync(oldPath, newPath);

    return updated;
}

// Helper function to handle file update only scenario on template update
export async function handleTemplateFileUpdateOnly(template: ITemplate, id: string, file: Express.Multer.File) {
    const filename = generateFileName(template, file);
    const format = detectFormat(file);

    await HandleDeleteTemplateFile(template);

    const updated = await templateDbService.updateOne(id, { filename, format });
    if (!updated) throw new Error("Failed to update template in database");

    await handleWriteTemplateFile(updated, file);

    return updated;
}

// Helper function to handle both name and file update scenario on template update
export async function handleTemplateNameAndFileChange(
    template: ITemplate,
    id: string,
    payload: Partial<ITemplate>,
    file: Express.Multer.File
) {
    const filename = generateFileName(template, file);
    const format = detectFormat(file);

    await HandleDeleteTemplateFile(template);

    const updated = await templateDbService.updateOne(id, {
        ...payload,
        filename,
        format
    });

    if (!updated) throw new Error("Failed to update template in database");

    await handleWriteTemplateFile(updated, file);

    return updated;
}




