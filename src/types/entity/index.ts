import { Document, Schema } from "mongoose";

export interface IBlueprint extends Document {
    name: string;
    description?: string;
    data_structure: any;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ITemplate extends Document {
    blueprint_id: Schema.Types.ObjectId;
    name: string;
    filename: string;
    default: boolean;
    format: string;
    supported_output_formats: string[];
    language: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}


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

