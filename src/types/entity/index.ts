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