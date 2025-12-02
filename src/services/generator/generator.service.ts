import { getTemplatePath, mapToObject } from "../../utils/functions.utils";
import { validateData } from "./utils/generator.utils";
import { DocumentType, ITemplate, OutputFormat, ValidationError } from "../../interfaces";
import { generateDocx } from "./docx/docxGenerator.service";
import { generatePdf } from "./pdf/pdfGenerator.service";

export const documentGeneratorService = {
    generate
}

export interface GeneratorOptions {
    template: ITemplate;
    data: Record<string, any>;
    data_structure: Map<string, any>;
    output_format: OutputFormat
}

async function generate(options: GeneratorOptions) {
    const { template, data, data_structure, output_format } = options;
    const templatePath = getTemplatePath(template.filename)
    await validateData(data, mapToObject(data_structure));


    //Default case is optionnal since format is already checked in request with zod validator
    switch (output_format) {
        case DocumentType.DOCX:
            return generateDocx(templatePath, data);
        // case DocumentType.PDF:
        //     return generatePdf(templatePath, data);
        default:
            throw new ValidationError(`Unsupported output format: ${output_format}`);
    }
};




