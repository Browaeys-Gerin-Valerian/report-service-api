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
        this.name = 'ValidationError';
        this.details = details;
    }
}

/**
 * Async error handler wrapper for Express controllers
 * Automatically catches errors and sends appropriate HTTP responses
 * 
 * Usage:
 * export const myController = asyncErrorHandler(async (req, res) => {
 *   // Your code here
 *   // Throw ValidationError for 400 responses
 *   // Throw Error for 500 responses
 * });
 */
export function asyncErrorHandler(fn: (req: any, res: any) => Promise<any>) {
    return async (req: any, res: any) => {
        try {
            await fn(req, res);
        } catch (err) {
            // Handle ValidationError with 400 status
            if (err instanceof ValidationError) {
                return res.status(400).json({
                    error: err.message,
                    details: err.details
                });
            }

            // Handle all other errors with 500 status
            const errorMessage = err instanceof Error ? err.message : "Unknown error";
            return res.status(500).json({
                error: "Internal server error",
                details: errorMessage
            });
        }
    };
}



