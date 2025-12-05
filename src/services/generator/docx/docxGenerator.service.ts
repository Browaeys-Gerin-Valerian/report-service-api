import fs from "fs";
import createReport from 'docx-templates';
import { config } from "../../../config"
import { ValidationError } from "../../../types";
import { injectImg } from "./utils/injectImg";
const { TEMPLATE_CMD_DELIMITER } = config



export async function generateDocx(
    templatePath: string,
    data_to_insert: Record<string, any>,
) {
    const template = fs.readFileSync(templatePath);
    try {
        const buffer = await createReport({
            template,
            data: data_to_insert,
            cmdDelimiter: TEMPLATE_CMD_DELIMITER,
            //tag is recovered from the docx example {IMAGE injectImg('image_1')} tag will be image_1
            additionalJsContext: {
                injectImg: (tag: string) => injectImg(tag, data_to_insert)
            },
            errorHandler: (err, command_code) => {
                console.log({ err, command_code })
            },
        });

        return buffer;
    } catch (error) {
        throw new ValidationError(`Error filling DOCX: ${error}`);
    }
};

