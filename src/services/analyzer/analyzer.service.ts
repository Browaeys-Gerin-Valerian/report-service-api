import fs from "fs";
import { DataStructureSchema } from "@custom_types/entity";
import { DocumentType } from "@custom_types/index";
import { detectFormatFromFileName, ValidationError, getTemplatePath } from "@utils/functions.utils";
import { docxAnalyzer } from "./docx/docxAnalyzer.service";

export interface analyzerOptions {
    filename: string;
    data_structure: DataStructureSchema;
}

export const analyzeService = {
    analyze
}

async function analyze(options: analyzerOptions) {

    const { filename, data_structure } = options;

    const templatePath = getTemplatePath(filename);

    const template = fs.readFileSync(templatePath).buffer;

    const extension = detectFormatFromFileName(filename);


    switch (extension) {
        case DocumentType.DOCX:
            return docxAnalyzer(template, data_structure);
        default:
            throw new ValidationError(`Not able ta parse: ${filename}`);
    }
};
