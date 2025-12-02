import fs from "fs";

export async function generateDocx<T>(templatePath: string, data: T) {
    const templateBuffer = fs.readFileSync(templatePath);
    const buffer = {}
    return buffer;
};
