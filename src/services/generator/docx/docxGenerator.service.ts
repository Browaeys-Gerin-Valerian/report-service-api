import fs from "fs";
import createReport from 'docx-templates';
import { config } from "../../../config"
import { ValidationError } from "../../../interfaces";
const { TEMPLATE_CMD_DELIMITER } = config

export async function generateDocx<T>(templatePath: string, data: T) {
    const template = fs.readFileSync(templatePath);
    try {
        const buffer = await createReport({
            template,
            data,
            cmdDelimiter: TEMPLATE_CMD_DELIMITER,
            errorHandler: (err, command_code) => {
                console.log({ err, command_code })
            },
        });
        return buffer;
    } catch (error) {
        throw new ValidationError(`Error filling DOCX: ${error}`);
    }
};
