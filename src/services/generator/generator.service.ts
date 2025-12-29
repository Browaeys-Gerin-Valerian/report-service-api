import { DataSchema, DataStructureSchema, } from "@custom_types/entity";
import { DocumentType, OutputFormat } from "@custom_types/index";
import { ITemplate } from "@custom_types/entity";
import { docxGenerator } from "./docx/docxGenerator.service";
import { pdfGenerator } from "./pdf/pdfGenerator.service";
import { xlsxGenerator } from "./xlsx/xlsxGenerator.service";
import { ValidationError } from "../../utils/functions.utils";
import { validateData } from "./utils/generator.utils";

export interface GeneratorOptions {
    template: ITemplate;
    data_structure: DataStructureSchema;
    data_to_insert: DataSchema
    files: Express.Multer.File[]
    output_format: OutputFormat
}


export const documentGeneratorService = {
    generate
}

async function generate(options: GeneratorOptions) {

    const { template, files, data_structure, data_to_insert, output_format } = options;

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
    */
    validateData(data_structure, data_to_insert, files);

    switch (output_format) {
        case DocumentType.DOCX:
            return docxGenerator(template, data_to_insert, files)
        case DocumentType.PDF:
            return pdfGenerator(template, data_to_insert, files);
        case DocumentType.XLSX:
            return xlsxGenerator(template, data_to_insert);
        default:
            throw new ValidationError(`Unsupported output format: ${output_format}`);
    }
};




