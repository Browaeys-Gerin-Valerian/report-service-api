import { Document, Schema } from "mongoose";


export enum DocumentType {
    PDF = "pdf",
    DOCX = "docx",
    HTML = "html",
    PPTX = "pptx",
}

export type OutputFormat = "docx" | "pdf"

export type FieldType = "text" | "list" | "table" | "image" | "object";

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

export class ValidationError extends Error {
    public details: string[];
    constructor(message: string, details: string[] = []) {
        super(message);
        this.details = details;
    }
}
