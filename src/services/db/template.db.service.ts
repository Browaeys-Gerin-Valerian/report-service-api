import { FilterQuery, UpdateQuery } from "mongoose";
import { ITemplate } from "@custom_types/entity";
import TemplateModel from "@models/template.model";

export const templateDbService = {
    getAll,
    getOneById,
    createOne,
    updateOne,
    deleteOne,
    deleteManyByBlueprintId,
    unsetDefaultTemplatesForBlueprint
};

export async function getAll(filter: FilterQuery<ITemplate> = {}) {
    return TemplateModel.find(filter).exec();
}

export async function getOneById(id: string) {
    return TemplateModel.findById(id).exec();
}


export async function createOne(payload: Partial<ITemplate>): Promise<ITemplate> {
    const doc = new TemplateModel(payload);
    return doc.save();
}

//query used when a new template is created  with default=true to unset previous default templates for the same blueprint
export async function unsetDefaultTemplatesForBlueprint(blueprint_id: string) {
    await TemplateModel.updateMany(
        { blueprint_id },
        { $set: { default: false } }
    );
}


export async function updateOne(id: string, payload: UpdateQuery<ITemplate>) {
    return TemplateModel.findByIdAndUpdate(id, payload, { new: true }).exec();
}

export async function deleteOne(id: string) {
    return TemplateModel.findByIdAndDelete(id).exec();
}

export async function deleteManyByBlueprintId(blueprint_id: string) {
    return TemplateModel.deleteMany({ blueprint_id }).exec();
}
