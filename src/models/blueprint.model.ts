import mongoose, { Schema } from "mongoose";
import fs from "fs";
import path from "path";
import { IBlueprint } from "../interfaces";
import { templateDbService } from "../services/template.db.service";
import { generateFileName } from "../utils/templates.utils";
import { config } from "../config";
const { TEMPLATE_DIR } = config;



const BlueprintSchema = new Schema<IBlueprint>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        data_structure: { type: Schema.Types.Mixed, required: true },
    },
    { timestamps: true }
);

// Pre-hook to handle cascading deletions of associated templates and their files
BlueprintSchema.pre("findOneAndDelete", async function () {
    const query = this as any;
    const blueprint = await query.model.findOne(query.getFilter());

    if (!blueprint) return;

    const templates = await templateDbService.getAll({ blueprint_id: blueprint._id });

    for (const tpl of templates) {
        const finalFileName = generateFileName(tpl);
        const finalPath = path.join(TEMPLATE_DIR, finalFileName);
        console.log("Deleting template file at path:", finalPath);
        if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath);
    }

    await templateDbService.deleteManyByBlueprintId(blueprint._id);
});


export default mongoose.model<IBlueprint>("blueprints", BlueprintSchema);