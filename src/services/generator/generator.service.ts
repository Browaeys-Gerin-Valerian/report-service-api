import { getTemplatePath, mapToObject } from "../../utils/functions.utils";
import { validateData } from "./utils/validateData";
import { DocumentType, ITemplate, OutputFormat, ValidationError } from "../../interfaces";
import { generateDocx } from "./docx/docxGenerator.service";
import { generatePdf } from "./pdf/pdfGenerator.service";
import { resolveImages } from "./utils/resolveImages";


export const documentGeneratorService = {
    generate
}

export interface GeneratorOptions {
    template: ITemplate;
    data_to_insert: Record<string, any>;
    files: Express.Multer.File[]
    data_structure: Map<string, any>;
    output_format: OutputFormat
}

async function generate(options: GeneratorOptions) {

    const { template, files, data_to_insert, data_structure, output_format } = options;

    // Match each image entry in data_to_insert with the uploaded files.
    // For each image:
    // - Look at `body.data.meta.filename` (the name declared in the JSON payload)
    // - Find the corresponding file in `files[]` by comparing with `file.originalname`
    // - This ensures that the correct uploaded file is associated with the correct image field
    // - You can then attach the file buffer, validate dimensions, or process further before generating the document
    resolveImages(data_to_insert, files);

    const templatePath = getTemplatePath(template.filename)

    /**
 * Recursively validates `data_to_insert` against the `data_structure` blueprint.
 * 
 * - Checks required fields.
 * - Dispatches validation based on field type:
 *   - "text": ensures value is a string.
 *   - "object": recursively validates nested fields.
 *   - "list": validates each item against its schema.
 *   - "table": validates each row and column against column schema.
 *   - "image": ensures that `meta` exists (filename, width, height) and that
 * 
 * Throws `ValidationError` if any required field is missing or if a value does not match its schema.
 * 
 */

    // await validateData(data_to_insert, mapToObject(data_structure));


    //Default case is optionnal since format is already checked in request with zod validator
    switch (output_format) {
        case DocumentType.DOCX:
            return generateDocx(templatePath, data_to_insert);
        // case DocumentType.PDF:
        //     return generatePdf(templatePath, data);
        default:
            throw new ValidationError(`Unsupported output format: ${output_format}`);
    }
};




