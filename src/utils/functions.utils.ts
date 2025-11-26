import { DocumentType } from '../interfaces'


export function detectFormat(file: Express.Multer.File): string {
    const ext = file.originalname.split(".").pop()?.toLowerCase();
    if (!ext) throw new Error("Unable to detect file format");

    switch (ext) {
        case "pdf":
            return DocumentType.PDF;
        case "docx":
            return DocumentType.DOCX;
        default:
            throw new Error(`Unsupported template format: ${ext}`);
    }
}

export function isBodyEmpty(body: any): boolean {
    if (body === null || body === undefined) return true;

    if (typeof body === 'string') return body.trim().length === 0;

    if (typeof body === 'object') return Object.keys(body).length === 0;

    return false;
}

