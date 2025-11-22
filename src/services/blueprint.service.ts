import { IBlueprint } from "../interfaces";
import BlueprintModel from "../models/blueprint.model";
import { FilterQuery, UpdateQuery } from "mongoose";

export const blueprintService = {
    getAll,
    createOne,
    getOneById,
    updateOne,
    deleteOne,
};


export async function getAll(filter: FilterQuery<IBlueprint> = {}, opts: { limit?: number; skip?: number; sort?: any } = {}) {
    const q = BlueprintModel.find(filter);
    if (opts.sort) q.sort(opts.sort);
    if (opts.skip) q.skip(opts.skip);
    if (opts.limit) q.limit(opts.limit);
    return q.exec();
}

export async function createOne(payload: Partial<IBlueprint>): Promise<IBlueprint> {
    const doc = new BlueprintModel(payload);
    return doc.save();
}

export async function getOneById(id: string) {
    return BlueprintModel.findById(id).populate(["templates", "model"]).exec();
}

export async function updateOne(id: string, update: UpdateQuery<IBlueprint>) {
    return BlueprintModel.findByIdAndUpdate(id, update, { new: true }).populate(["templates", "model"]).exec();
}

export async function deleteOne(id: string) {
    return BlueprintModel.findByIdAndDelete(id).exec();
}

