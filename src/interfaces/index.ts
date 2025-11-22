import { Document } from "mongoose";


export enum DocumentType {
    PDF = "PDF",
    DOCX = "DOCX",
    HTML = "HTML",
    PPTX = "PPTX",
}

export interface IBlueprintModel extends Document {
    name: string;
    model_path: string;
    data_structure: any; // flexible object that can fit anything
    templates: ITemplate[]; // refs to TemplateModel or embedded
    createdAt?: Date;
    updatedAt?: Date;
}


export interface ITemplate extends Document {
    name: string;
    default: boolean;
    template_file: string;
    format: string;
    supported_output_formats: string[];
    language: string;
    data_structure_checks: any; // flexible object matching expected data structure
    createdAt?: Date;
    updatedAt?: Date;
}
