import mongoose, { Schema } from "mongoose";
import fs from "fs";
import path from "path";
import { IBlueprint } from "../interfaces";
import { templateService } from "../services/template.service";


const BlueprintSchema = new Schema<IBlueprint>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        data_structure: { type: Schema.Types.Mixed, required: true, default: {} },
    },
    { timestamps: true }
);

// Pre-hook to handle cascading deletions of associated templates and their files
BlueprintSchema.pre("findOneAndDelete", async function () {
    const query = this as any;
    const blueprint = await query.model.findOne(query.getFilter());

    if (!blueprint) return;

    const templates = await templateService.getAll({ blueprint_id: blueprint._id });

    for (const tpl of templates) {
        const filePath = path.join(process.cwd(), "templates", tpl.name);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await templateService.deleteManyByBlueprintId(blueprint._id);
});


export default mongoose.model<IBlueprint>("blueprints", BlueprintSchema);