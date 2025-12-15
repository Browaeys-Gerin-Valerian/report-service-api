import fs from "fs";
import path from 'path';
import { DocumentType } from '@custom_types/index'
import { config } from "@config/index";
const { TEMPLATE_DIR } = config
import { OutputFormat } from "@custom_types/index"

export function isObject(value: any): value is Record<string, any> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}


export function isNotEmptyObject(obj: any): boolean {
    return obj != null
        && typeof obj === "object"
        && Object.keys(obj).length > 0;
}

export function mapToObject(map: Map<string, any>): Record<string, any> {
    return Object.fromEntries(map);
}

export function getTemplatePath(filename: string) {
    const filePath = path.join(TEMPLATE_DIR, filename);
    if (!fs.existsSync(filePath)) {
        throw new Error(`Template not found: ${filePath}`);
    }
    return filePath;
};


export function detectContentType(outputFormat: OutputFormat): string {
    switch (outputFormat) {
        case "pdf":
            return "application/pdf";
        case "docx":
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        default:
            throw new Error(`Unsupported output format: ${outputFormat}`);
    }
}



export function detectFormatFromFile(file: Express.Multer.File): string {
    const ext = file.originalname.split(".").pop()?.toLowerCase();
    if (!ext) throw new Error("Unable to detect file format");

    switch (ext) {
        case "pdf":
            return DocumentType.PDF;
        case "docx":
            return DocumentType.DOCX;
        default:
            throw new Error(`Unsupported format: ${ext}`);
    }
}

export function detectFormatFromFileName(filename: string) {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (!ext) throw new Error("Unable to detect file format");
    return ext
}


export class ValidationError extends Error {
    public details: string[];
    constructor(message: string, details: string[] = []) {
        super(message);
        this.details = details;
    }
}



