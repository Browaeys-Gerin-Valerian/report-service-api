import { Request, Response } from "express";
import { templateDbService } from "../services/db/template.db.service";
import { templateFilesystemService } from "../services/filesystem/template.filesytem.service";
import { ValidatedRequest } from "../middlewares/zod/validateRequest.middleware";
import { blueprintDbService } from "../services/db/blueprint.db.service";

export const templateController = {
    getAll,
    getOneById,
    createOne,
    updateOne,
    deleteOne,
};

export async function getAll(req: Request, res: Response) {
    try {
        const doc = await templateDbService.getAll();
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: "Failed to list templates", details: err });
    }
}

export async function getOneById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const doc = await templateDbService.getOneById(id);
        if (!doc) return res.status(404).json({ error: "Template not found" });
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch template", details: err });
    }
}

export async function createOne(req: Request, res: Response) {
    try {
        const { body, file } = (req as ValidatedRequest).validated;
        const { data } = body;
        const { blueprint_id } = data

        const blueprint = await blueprintDbService.getOneById(blueprint_id)
        if (!blueprint) return res.status(404).json({ error: "Blueprint to link with template not found" });

        const doc = await templateFilesystemService.createOne(data, file);
        res.status(201).json(doc);
    } catch (err) {
        res.status(500).json({ error: "Failed to create template", details: err });
    }
}


export async function updateOne(req: Request, res: Response) {
    try {
        const { params, body, file } = (req as ValidatedRequest).validated;
        const { id } = params;
        const { data } = body;
        const doc = await templateFilesystemService.updateOne(id, data, file);
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: "Failed to update template", details: err });
    }
}

export async function deleteOne(req: Request, res: Response) {
    try {
        const { params } = (req as ValidatedRequest).validated;
        const { id } = params;
        const doc = await templateDbService.deleteOne(id);
        if (!doc) return res.status(404).json({ error: "Template not found" });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: "Failed to delete template", details: err });
    }
}