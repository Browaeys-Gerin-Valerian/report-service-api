import mongoose, { Schema } from "mongoose";
import fs from "fs";
import path from "path";
import { IBlueprint } from "@custom_types/entity";
import { templateDbService } from "@services/db/template.db.service";
import { config } from "@config/index";
const { TEMPLATE_DIR } = config;



const BlueprintSchema = new Schema<IBlueprint>(
    {
        name: { type: String, required: true, trim: true, unique: true },
        description: { type: String, default: "" },
        data_structure: {
            type: Map,
            of: Schema.Types.Mixed,
            required: false,
            default: {},
        },
    },
    { timestamps: true }
);



//Virtual used to populate blueprint with his associateed templates 
BlueprintSchema.virtual("templates", {
    ref: "templates",
    localField: "_id",
    foreignField: "blueprint_id",
});
BlueprintSchema.set("toObject", { virtuals: true });
BlueprintSchema.set("toJSON", { virtuals: true });



// Pre-hook to handle cascading deletions of associated templates and their files on blueprint deletion
BlueprintSchema.pre("findOneAndDelete", async function () {
    const query = this as any;
    const blueprint = await query.model.findOne(query.getFilter());

    if (!blueprint) return;

    const templates = await templateDbService.getAll({ blueprint_id: blueprint._id });

    for (const tpl of templates) {
        const finalPath = path.join(TEMPLATE_DIR, tpl.filename);
        if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath);
    }

    await templateDbService.deleteManyByBlueprintId(blueprint._id);
});


export default mongoose.model<IBlueprint>("blueprints", BlueprintSchema);