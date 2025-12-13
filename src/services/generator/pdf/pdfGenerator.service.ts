import { DataSchema, DataStructureSchema } from "@custom_types/entity";
import { ITemplate } from "@custom_types/entity";
import { docxGenerator } from "../docx/docxGenerator.service";
import { generate } from "./generate.service";


/**
 * Generates a PDF document by:
 * 1. Generating a DOCX using the docxGenerator
 * 2. Converting DOCX to HTML using mammoth
 * 3. Converting HTML to PDF using puppeteer
 */
export async function pdfGenerator(
    template: ITemplate,
    data_structure: DataStructureSchema,
    data_to_insert: DataSchema,
    files: Express.Multer.File[]
) {

    const docxBuffer = await docxGenerator(template, data_structure, data_to_insert, files);
    return generate(docxBuffer);


};