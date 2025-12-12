import { IFile } from "./entity";

export class ValidationError extends Error {
    public details: string[];
    constructor(message: string, details: string[] = []) {
        super(message);
        this.details = details;
    }
}


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

// --------------------------
// INJECTABLE DATA DEFINITION
// --------------------------

export type DataText = string;

export type DataObject = {
    fields: Record<string, DataValue>;
};

export type DataCollection = {
    items: DataValue[];
};


export type DataImage = {
    id: string,
    filename: string;
};

export type EnrichedDataImage = DataImage & { data: Buffer, extension: string }


export type DataValue =
    | DataText
    | DataObject
    | DataCollection
    | DataImage

export type DataSchema = Record<string, DataValue>;


// --------------------------
// DATA STRUCTURE DEFINITION
// --------------------------

export type BaseStructure = {
    required: boolean
}


export type DataStructureText = BaseStructure & {
    type: "text";
}

export type DataStructureObject = BaseStructure & {
    type: "object";
    fields: Record<string, DataStructure>;
}

export type DataStructureCollection = BaseStructure & {
    type: "collection";
    items: DataStructure[];
}


export type DataStructureImage = BaseStructure & {
    type: "image";
}

export type DataStructure =
    | DataStructureText
    | DataStructureObject
    | DataStructureCollection
    | DataStructureImage;

export type DataStructureSchema = Record<string, DataStructure>;





