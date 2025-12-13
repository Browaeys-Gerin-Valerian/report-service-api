import { DataSchema, DataStructureSchema, } from "../../types/entity";
import { DocumentType, OutputFormat } from "../../types";
import { ITemplate } from "../../types/entity"
import { docxGenerator } from "./docx/docxGenerator.service";
import { pdfGenerator } from "./pdf/pdfGenerator.service";
import { ValidationError } from "../../utils/functions.utils";

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

    switch (output_format) {
        case DocumentType.DOCX:
            return docxGenerator(template, data_structure, data_to_insert, files)
        case DocumentType.PDF:
            return pdfGenerator(template, data_structure, data_to_insert, files);
        default:
            throw new ValidationError(`Unsupported output format: ${output_format}`);
    }
};




