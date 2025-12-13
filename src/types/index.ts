export enum DocumentType {
    PDF = "pdf",
    DOCX = "docx",
    HTML = "html",
    PPTX = "pptx",
}

export type OutputFormat = "docx" | "pdf"


export type FieldType = "text" | "object" | "collection" | "image"


export const IMAGE_PRESETS = {
    small: { width: 10, height: 10 },
    medium: { width: 25, height: 25 },
    large: { width: 40, height: 40 }
} as const;

export type ImagePreset = keyof typeof IMAGE_PRESETS;





