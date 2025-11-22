import mongoose, { Schema } from "mongoose";
import { DocumentType, ITemplate } from "../interfaces";

const TemplateSchema = new Schema<ITemplate>(
    {
        name: { type: String, required: true, trim: true },
        default: { type: Boolean, default: false },
        template_file: { type: String, required: true },
        format: { type: String, required: true },
        supported_output_formats: { type: [String], default: [DocumentType.PDF, DocumentType.DOCX] },
        language: { type: String, default: "EN" },
        data_structure_checks: { type: Schema.Types.Mixed, default: {} },
    },
    { timestamps: true }
);


export default mongoose.model<ITemplate>("templates", TemplateSchema);