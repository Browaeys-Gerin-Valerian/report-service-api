import mongoose, { Schema } from "mongoose";
import { IBlueprint } from "../interfaces";


const BlueprintSchema = new Schema<IBlueprint>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        data_structure: { type: Schema.Types.Mixed, required: true, default: {} },
    },
    { timestamps: true }
);

export default mongoose.model<IBlueprint>("blueprints", BlueprintSchema);