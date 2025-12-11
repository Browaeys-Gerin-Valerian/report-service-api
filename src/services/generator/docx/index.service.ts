import { DataSchema, DataStructure } from "../../../types";
import { ITemplate } from "../../../types/entity";
import { getTemplatePath, mapToObject } from "../../../utils/functions.utils";
import { resolveImages } from "../utils/resolveImages";
import { validateData } from "../utils/validateData";
import { generateDocx } from "./docxGenerator.service";



export async function docxGenerator(
    template: ITemplate,
    data_structure: Map<string, DataStructure>,
    data_to_insert: DataSchema,
    files: Express.Multer.File[]
) {
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
*   - "image": ensures that filename and associated file exist
* 
* Throws `ValidationError` if any required field is missing or if a value does not match its schema.
* 
*/
    validateData(mapToObject(data_structure), data_to_insert);

    // Match each image entry in data_to_insert with the uploaded files.
    // For each image:
    // - Look at `body.data.meta.filename` (the name declared in the JSON payload)
    // - Find the corresponding file in `files[]` by comparing with `file.originalname`
    // - This ensures that the correct uploaded file is associated with the correct image field
    // - You can then attach the file buffer, validate dimensions, or process further before generating the document
    resolveImages(data_to_insert, files);

    return generateDocx(templatePath, data_to_insert);
};
