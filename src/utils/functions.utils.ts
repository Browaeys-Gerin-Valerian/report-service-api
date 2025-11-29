import { DocumentType } from '../interfaces'

export function isNotEmptyObject(obj: any): boolean {
    return obj != null
        && typeof obj === "object"
        && Object.keys(obj).length > 0;
}


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

export function parsedBody(rawBody: any): Record<string, any> {

    const parsedBody: Record<string, any> = {};
    for (const key of Object.keys(rawBody)) {
        const value = rawBody[key];

        if (typeof value === "string") {
            try {
                parsedBody[key] = JSON.parse(value);
            } catch {
                parsedBody[key] = value;
            }
        } else {
            parsedBody[key] = value;
        }
    }
    return parsedBody;
}

