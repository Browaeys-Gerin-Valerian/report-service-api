import fs from "fs";
import path from "path";

const TEMPLATE_DIR = path.join(process.cwd(), "templates");

if (!fs.existsSync(TEMPLATE_DIR)) {
    fs.mkdirSync(TEMPLATE_DIR);
}

export function generateFileName(templateId: string) {
    return `${Date.now()}-${templateId}`;
}

export function saveUploadedFile(tempFilePath: string, finalFileName: string) {
    const finalPath = path.join(TEMPLATE_DIR, finalFileName);
    fs.renameSync(tempFilePath, finalPath);
    return finalFileName;
}

export function deleteFileIfExists(fileName: string) {
    const filePath = path.join(TEMPLATE_DIR, fileName);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}


