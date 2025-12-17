import { Request, Response } from "express";
import { templateDbService } from "@services/db/template.service";
import { templateFilesystemService } from "@services/filesystem/filesystem.service";
import { ValidatedRequest } from "@middlewares/zod/validateRequest.middleware";
import { blueprintDbService } from "@services/db/blueprint.service";
import { analyzeService } from "@services/analyzer/analyzer.service";
import { mapToObject, asyncHandler } from "@utils/functions.utils";

export const templateController = {
    getAll: asyncHandler(getAll),
    getOneById: asyncHandler(getOneById),
    createOne: asyncHandler(createOne),
    updateOne: asyncHandler(updateOne),
    deleteOne: asyncHandler(deleteOne),
    analyze: asyncHandler(analyze),
};

async function getAll(req: Request, res: Response) {
    const doc = await templateDbService.getAll();
    res.json(doc);
}

async function getOneById(req: Request, res: Response) {
    const { id } = req.params;
    const doc = await templateDbService.getOneById(id);
    if (!doc) return res.status(404).json({ error: "Template not found" });
    res.json(doc);
}

async function createOne(req: Request, res: Response) {
    const { body, file } = (req as ValidatedRequest).validated;
    const { data } = body;
    const { blueprint_id } = data

    const blueprint = await blueprintDbService.getOneById(blueprint_id)
    if (!blueprint) return res.status(404).json({ error: "Blueprint to link with template not found" });

    const doc = await templateFilesystemService.createOne(data, file);
    res.status(201).json(doc);
}


async function updateOne(req: Request, res: Response) {
    const { params, body, file } = (req as ValidatedRequest).validated;
    const { id } = params;
    const { data } = body;
    const docToUpdate = await templateDbService.getOneById(id);
    if (!docToUpdate) return res.status(404).json({ error: "Template not found" });
    const doc = await templateFilesystemService.updateOne(id, docToUpdate, data, file);
    res.json(doc);
}

async function deleteOne(req: Request, res: Response) {
    const { params } = (req as ValidatedRequest).validated;
    const { id } = params;
    const doc = await templateDbService.deleteOne(id);
    if (!doc) return res.status(404).json({ error: "Template not found" });
    res.status(204).send();
}

async function analyze(req: Request, res: Response) {
    const { params } = (req as ValidatedRequest).validated;
    const { id } = params;

    const template = await templateDbService.getOneById(id);
    if (!template) return res.status(404).json({ error: "Template not found" });

    const blueprint = await blueprintDbService.getOneById(template.blueprint_id.toString());
    if (!blueprint) return res.status(404).json({ error: "Blueprint not found" });

    const analysis = await analyzeService.analyze(
        {
            filename: template.filename,
            data_structure: mapToObject(blueprint.data_structure)
        }
    );

    res.json(analysis);
}