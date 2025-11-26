import fs from "fs";
import path from "path";
import { config } from "../config";
import { ITemplate } from "../interfaces";
import { templateDbService } from "../services/template.db.service";
const { TEMPLATE_DIR } = config;

if (!fs.existsSync(TEMPLATE_DIR)) {
    fs.mkdirSync(TEMPLATE_DIR);
}

export function generateFileName(template: ITemplate) {
    const { _id, name } = template;
    return `${name}-${_id.toString()}`;
}

export async function writeTemplateFileOrRollback(doc: ITemplate, file: Express.Multer.File): Promise<ITemplate> {
    const finalName = generateFileName(doc);
    const finalPath = path.join(TEMPLATE_DIR, finalName);
    try {
        fs.writeFileSync(finalPath, file.buffer);
        return doc;
    } catch (err) {
        // Rollback DB entry if filesystem write fails
        await templateDbService.deleteOne(doc._id.toString());
        throw err;
    }
}

// Updates the template file by deleting the old one and writing the new one
export async function updateTemplateFile(template: ITemplate, file: Express.Multer.File): Promise<ITemplate> {
    await deleteTemplateFile(template);
    return await writeTemplateFileOrRollback(template, file);
}

export async function deleteTemplateFile(template: ITemplate): Promise<void> {
    const finalName = generateFileName(template);
    const finalPath = path.join(TEMPLATE_DIR, finalName);
    if (fs.existsSync(finalPath)) {
        fs.unlinkSync(finalPath);
    }
}

