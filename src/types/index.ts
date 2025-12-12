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
    meta: {
        filename: string;
        width: number;
        height: number;
        file: IFile
    };
};


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





