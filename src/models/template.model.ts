import fs from "fs";
import mongoose, { Schema } from "mongoose";
import { DocumentType, ITemplate } from "../interfaces";
import { config } from "../config";
import path from "path";
import { generateFileName } from "../utils/templates.utils";
import { templateDbService } from "../services/template.db.service";
const { TEMPLATE_DIR } = config;

const TemplateSchema = new Schema<ITemplate>(
    {
        blueprint_id: { type: Schema.Types.ObjectId, ref: "blueprints", required: true },
        name: { type: String, required: true, trim: true },
        default: { type: Boolean, default: false },
        format: { type: String, required: true },
        supported_output_formats: { type: [String], default: [DocumentType.PDF, DocumentType.DOCX] },
        language: { type: String, default: "EN", required: true },
    },
    { timestamps: true }
);

//Mongoose hook to delete the associated file when a template is deleted
TemplateSchema.post("findOneAndDelete", async function (doc) {
    if (!doc) return;
    const fileName = generateFileName(doc);
    const filePath = path.join(TEMPLATE_DIR, fileName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
});

//Mongoose hook to ensure only one default template per blueprint
TemplateSchema.pre("save", async function (next) {
    const doc = this as ITemplate;
    if (!doc) return next();
    if (doc.default === true) await templateDbService.unsetDefaultTemplatesForBlueprint(doc.blueprint_id.toString());
    next();
});

export default mongoose.model<ITemplate>("templates", TemplateSchema);