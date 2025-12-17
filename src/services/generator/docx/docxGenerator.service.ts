import { DataSchema, DataStructureSchema } from "@custom_types/entity";
import { ITemplate } from "@custom_types/entity";
import { getTemplatePath } from "@utils/functions.utils";
import { validateData } from "./utils/validateData";
import { generate } from "./generate.service";



export async function docxGenerator(
    template: ITemplate,
    data_structure: DataStructureSchema,
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
*   - "collection": validates each item against its schema.
*   - "image": ensures that filename and associated file exist
* 
* Throws `ValidationError` if any required field is missing or if a value does not match its schema.
* 
*/
    validateData(data_structure, data_to_insert, files);
    return generate(templatePath, data_to_insert, files);
};
