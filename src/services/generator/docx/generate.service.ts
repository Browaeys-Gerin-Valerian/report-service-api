import fs from "fs";
import createReport from 'docx-templates';
import { config } from "@config/index"
import { DataSchema } from "@custom_types/entity";
import { ImagePreset } from "@custom_types/index";
import { injectImg } from "./utils/injectImg";
import { resolveImages } from "./utils/resolveImage";
import { ValidationError } from "@utils/functions.utils";
const { TEMPLATE_CMD_DELIMITER } = config


export async function generate(
    templatePath: string,
    data_to_insert: DataSchema,
    files: Express.Multer.File[]
) {
    const template = fs.readFileSync(templatePath);
    const images = resolveImages(data_to_insert, files);

    try {
        const buffer = await createReport({
            template,
            data: data_to_insert,
            cmdDelimiter: TEMPLATE_CMD_DELIMITER,
            additionalJsContext: {
                injectImg: (id: string, width: number, height: number, preset: ImagePreset, caption: string) => injectImg(id, width, height, preset, caption, images)
            },
            //THIS PREVENT DOCX-TEMPLATES TO CRASH WHEN HE ENCOUNTER AN UNKNOW KEY DON'T REMOVE THIS LINE UNLESS YOU WANT TO UPDATE DOCX-TEMPLATES BEHAVIOR
            errorHandler: (err, command_code) => { },
        });

        return buffer;
    } catch (error) {
        throw new ValidationError(`Error filling DOCX: ${error}`);
    }
};

