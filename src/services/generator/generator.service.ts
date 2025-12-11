import { DocumentType, OutputFormat, ValidationError } from "../../types";
import { ITemplate } from "../../types/entity"
import { mapToObject } from "../../utils/functions.utils";
import { docxGenerator } from "./docx/index.service";
import { validateData } from "./utils/validateData";


export const documentGeneratorService = {
    generate
}

export interface GeneratorOptions {
    template: ITemplate;
    data_structure: Map<string, any>;
    data_to_insert: Record<string, any>;
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




