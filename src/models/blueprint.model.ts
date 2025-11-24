import mongoose, { Schema } from "mongoose";
import { IBlueprint } from "../interfaces";


const BlueprintSchema = new Schema<IBlueprint>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        model_path: { type: String },
        data_structure: { type: Schema.Types.Mixed, required: true, default: {} },
        templates: [{ type: Schema.Types.ObjectId, ref: "templates" }],
    },
    { timestamps: true }
);

// Pre-save hook to set model_path based on name
BlueprintSchema.pre("save", function (next) {
    this.model_path = `/templates/${this.name}`;
    next();
});

export default mongoose.model<IBlueprint>("blueprints", BlueprintSchema);