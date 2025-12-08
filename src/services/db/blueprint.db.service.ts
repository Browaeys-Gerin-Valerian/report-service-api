
import { FilterQuery, UpdateQuery } from "mongoose";
import { IBlueprint } from "../../types/entity";
import BlueprintModel from "../../models/blueprint.model";

export const blueprintDbService = {
    getAll,
    createOne,
    getOneById,
    updateOne,
    deleteOne,
};


export async function getAll(filter: FilterQuery<IBlueprint> = {}) {
    return BlueprintModel.find(filter).exec();
}

export async function createOne(payload: Partial<IBlueprint>): Promise<IBlueprint> {
    const doc = new BlueprintModel(payload);
    return doc.save();
}

export async function getOneById(
    id: string,
    options?: { populate?: boolean }
) {
    let query = BlueprintModel.findById(id);

    if (options?.populate) {
        query = query.populate("templates");
    }

    return query.exec();
}




export async function updateOne(id: string, update: UpdateQuery<IBlueprint>) {
    return BlueprintModel.findByIdAndUpdate(id, update, { new: true }).exec();
}

export async function deleteOne(id: string) {
    return BlueprintModel.findByIdAndDelete(id).exec();
}

