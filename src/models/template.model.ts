import fs from "fs";
import mongoose, { Schema } from "mongoose";
import { DocumentType, ITemplate } from "../types";
import { config } from "../config";
import path from "path";
import { templateDbService } from "../services/db/template.db.service";
const { TEMPLATE_DIR } = config;

const TemplateSchema = new Schema<ITemplate>(
    {
        blueprint_id: { type: Schema.Types.ObjectId, ref: "blueprints", required: true },
        filename: { type: String, required: true },
        name: { type: String, required: true, trim: true },
        default: { type: Boolean, default: false },
        format: { type: String, required: true },
        supported_output_formats: { type: [String], default: [DocumentType.PDF, DocumentType.DOCX] },
        language: { type: String, required: true },
    },
    { timestamps: true }
);

//Mongoose hook to delete the associated file when a template is deleted
TemplateSchema.post("findOneAndDelete", async function (doc, next) {
    if (!doc) return next();
    const filePath = path.join(TEMPLATE_DIR, doc.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
});

//Mongoose hook to ensure only one default template per blueprint
TemplateSchema.pre("save", async function (next) {
    const doc = this as ITemplate;
    if (!doc) return next();
    if (doc.default === true) await templateDbService.unsetDefaultTemplatesForBlueprint(doc.blueprint_id.toString());
    next();
});

//Mongoose hook to ensure only one default template per blueprint on update 
TemplateSchema.pre("findOneAndUpdate", async function (next) {
    const doc = this.getUpdate() as ITemplate;
    //Cast boolean is needed because doc.default is typed as string on update documents
    if (Boolean(doc.default)) {
        //recover the blueprint_id from the document being updated, for unset other to default false
        const docToUpdate = await this.model.findOne(this.getFilter());
        if (docToUpdate) await templateDbService.unsetDefaultTemplatesForBlueprint(docToUpdate.blueprint_id.toString());

    }
    next();
});

export default mongoose.model<ITemplate>("templates", TemplateSchema);