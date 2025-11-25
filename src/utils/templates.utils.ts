import fs from "fs";
import path from "path";
import { config } from "../config";
import { ITemplate } from "../interfaces";
const { TEMPLATE_DIR } = config;

if (!fs.existsSync(TEMPLATE_DIR)) {
    fs.mkdirSync(TEMPLATE_DIR);
}

export function generateFileName(template: ITemplate) {
    const { _id, name } = template;
    return `${name}-${_id.toString()}`;
}

export function saveUploadedFile(tempFilePath: string, finalFileName: string) {
    const finalPath = path.join(TEMPLATE_DIR, finalFileName);
    fs.renameSync(tempFilePath, finalPath);
    return finalFileName;
}

