import { Request, Response } from "express";
import { blueprintDbService } from "@services/db/blueprint.service";
import { ValidatedRequest } from "@middlewares/zod/validateRequest.middleware";
import { asyncErrorHandler } from "@utils/functions.utils";


export const blueprintController = {
    getAll: asyncErrorHandler(getAll),
    getOneById: asyncErrorHandler(getOneById),
    createOne: asyncErrorHandler(createOne),
    updateOne: asyncErrorHandler(updateOne),
    deleteOne: asyncErrorHandler(deleteOne),
};


async function getAll(req: Request, res: Response) {
    const doc = await blueprintDbService.getAll();
    res.json(doc);
}

async function getOneById(req: Request, res: Response) {
    const { params, query } = (req as ValidatedRequest).validated;
    const { id } = params;

    const doc = await blueprintDbService.getOneById(id, {
        populate: query.withTemplates,
    });

    if (!doc) return res.status(404).json({ error: "Blueprint not found" });
    res.json(doc);
}


async function createOne(req: Request, res: Response) {
    const { body } = (req as ValidatedRequest).validated;
    const doc = await blueprintDbService.createOne(body);
    res.status(201).json(doc);
}

async function updateOne(req: Request, res: Response) {
    const { params, body } = (req as ValidatedRequest).validated;
    const { id } = params;
    const docToUpdate = await blueprintDbService.getOneById(id);
    if (!docToUpdate) return res.status(404).json({ error: "Blueprint not found" });
    const doc = await blueprintDbService.updateOne(id, body);
    res.json(doc);
}

async function deleteOne(req: Request, res: Response) {
    const { params } = (req as ValidatedRequest).validated;
    const { id } = params;
    const doc = await blueprintDbService.deleteOne(id);
    if (!doc) return res.status(404).json({ error: "Blueprint not found" });
    res.status(204).send();
}