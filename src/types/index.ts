export enum DocumentType {
    PDF = "pdf",
    DOCX = "docx",
    HTML = "html",
    PPTX = "pptx",
    XLSX = "xlsx",
}

export type OutputFormat = "docx" | "pdf" | "xlsx"


export type FieldType = "text" | "object" | "collection" | "image"


export const IMAGE_PRESETS = {
    small: { width: 5, height: 5 },
    medium: { width: 10, height: 10 },
    large: { width: 15, height: 15 }
} as const;

export type ImagePreset = keyof typeof IMAGE_PRESETS;





