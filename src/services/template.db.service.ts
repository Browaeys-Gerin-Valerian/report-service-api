import { FilterQuery, UpdateQuery } from "mongoose";
import { ITemplate } from "../interfaces";
import TemplateModel from "../models/template.model";
import { detectFormat } from "../utils/functions.utils";

export const templateDbService = {
    getAll,
    getOneById,
    createOne,
    updateOne,
    deleteOne,
    deleteManyByBlueprintId,
    unsetDefaultTemplatesForBlueprint
};

export async function getAll(filter: FilterQuery<ITemplate> = {}, opts: { limit?: number; skip?: number; sort?: any } = {}) {
    const q = TemplateModel.find(filter);
    if (opts.sort) q.sort(opts.sort);
    if (opts.skip) q.skip(opts.skip);
    if (opts.limit) q.limit(opts.limit);
    return q.exec();
}

export async function getOneById(id: string) {
    return TemplateModel.findById(id).exec();
}


export async function createOne(payload: Partial<ITemplate>, file: Express.Multer.File): Promise<ITemplate> {

    const format = detectFormat(file);

    const doc = new TemplateModel({
        ...payload,
        format,
    });
    return doc.save();
}

//query used when a new template is created  with default=true to unset previous default templates for the same blueprint
export async function unsetDefaultTemplatesForBlueprint(blueprint_id: string) {
    await TemplateModel.updateMany(
        { blueprint_id },
        { $set: { default: false } }
    );
}


export async function updateOne(id: string, update: UpdateQuery<ITemplate>) {
    return TemplateModel.findByIdAndUpdate(id, update, { new: true }).exec();
}

export async function deleteOne(id: string) {
    return TemplateModel.findByIdAndDelete(id).exec();
}

export async function deleteManyByBlueprintId(blueprint_id: string) {
    return TemplateModel.deleteMany({ blueprint_id }).exec();
}
