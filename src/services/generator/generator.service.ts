import { DataSchema, DataStructureSchema, DocumentType, OutputFormat, ValidationError } from "../../types";
import { ITemplate } from "../../types/entity"
import { docxGenerator } from "./docx/docxGenerator.service";



export const documentGeneratorService = {
    generate
}

export interface GeneratorOptions {
    template: ITemplate;
    data_structure: DataStructureSchema;
    data_to_insert: DataSchema
    files: Express.Multer.File[]
    output_format: OutputFormat
}

async function generate(options: GeneratorOptions) {

    const { template, files, data_structure, data_to_insert, output_format } = options;

    switch (output_format) {
        case DocumentType.DOCX:
            return docxGenerator(template, data_structure, data_to_insert, files)
        // case DocumentType.PDF:
        //     return generatePdf(templatePath, data);
        default:
            throw new ValidationError(`Unsupported output format: ${output_format}`);
    }
};




