import { required } from "zod/v4/core/util.cjs";
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


export type FieldType = "display" | "text" | "object" | "list" | "table" | "image"

// --------------------------
// INJECTABLE DATA DEFINITION
// --------------------------

export type DataText = string;

export type DataObject = {
    fields: Record<string, DataValue>;
};

export type DataList = {
    items: (DataText | DataObject | DataList)[];
};


export type DataImage = {
    meta: {
        filename: string;
        width: number;
        height: number;
        file: IFile
    };
};


export type DataTable = {
    rows: (DataText | DataObject | DataList)[];
};

export type DataValue =
    | DataText
    | DataObject
    | DataList
    | DataImage
    | DataTable;

export type DataSchema = Record<string, DataValue>;


// --------------------------
// DATA STRUCTURE DEFINITION
// --------------------------

export type BaseStructure = {
    required: boolean
}

export type DisplayStructure = {
    type: "display";
}

export type TextStructure = BaseStructure & {
    type: "text";
}

export type ObjectStructure = BaseStructure & {
    type: "object";
    fields: Record<string, DataStructure>;
}

export type ListStructure = BaseStructure & {
    type: "list";
    items: (TextStructure | ObjectStructure | ListStructure)[];
}

export type TableStructure = BaseStructure & {
    type: "table";
    rows: (TextStructure | ObjectStructure | ListStructure)[];
}

export type ImageStructure = BaseStructure & {
    type: "image";
}

export type DataStructure =
    | DisplayStructure
    | TextStructure
    | ObjectStructure
    | ListStructure
    | TableStructure
    | ImageStructure;

export type DataStructureSchema = Record<string, DataStructure>;





