import mongoose, { Schema } from "mongoose";
import { IBlueprint } from "../interfaces";


const BlueprintSchema = new Schema<IBlueprint>(
    {
        name: { type: String, required: true, trim: true },
        model_path: { type: String, required: true },
        data_structure: { type: Schema.Types.Mixed, required: true, default: {} },
        templates: [{ type: Schema.Types.ObjectId, ref: "template" }],
    },
    { timestamps: true }
);

export default mongoose.model<IBlueprint>("blueprints", BlueprintSchema);