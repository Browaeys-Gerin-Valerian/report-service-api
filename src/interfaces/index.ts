import { Document, Schema } from "mongoose";


export enum DocumentType {
    PDF = "pdf",
    DOCX = "docx",
    HTML = "html",
    PPTX = "pptx",
}

export interface IBlueprint extends Document {
    name: string;
    description?: string;
    data_structure: any; // flexible object that can fit anything
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
