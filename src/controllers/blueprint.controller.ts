import { Request, Response } from "express";
import { blueprintDbService } from "../services/db/blueprint.db.service";
import { ValidatedRequest } from "../middlewares/zod/validateRequest.middleware";


export const blueprintController = {
    getAll,
    getOneById,
    createOne,
    updateOne,
    deleteOne,
};


export async function getAll(req: Request, res: Response) {
    try {
        const doc = await blueprintDbService.getAll();
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: "Failed to list blueprints", details: err });
    }
}

export async function getOneById(req: Request, res: Response) {
    try {
        const { params } = (req as ValidatedRequest).validated;
        const { id } = params;
        const doc = await blueprintDbService.getOneById(id);
        if (!doc) return res.status(404).json({ error: "Blueprint not found" });
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch blueprint", details: err });
    }
}

export async function createOne(req: Request, res: Response) {
    try {
        const { body } = (req as ValidatedRequest).validated;
        const doc = await blueprintDbService.createOne(body);
        res.status(201).json(doc);
    } catch (err) {
        res.status(500).json({ error: "Failed to create blueprint", details: err });
    }
}

export async function updateOne(req: Request, res: Response) {
    try {
        const { params, body } = (req as ValidatedRequest).validated;
        const { id } = params;
        const doc = await blueprintDbService.updateOne(id, body);
        if (!doc) return res.status(404).json({ error: "Blueprint not found" });
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: "Failed to update blueprint", details: err });
    }
}

export async function deleteOne(req: Request, res: Response) {
    try {
        const { params } = (req as ValidatedRequest).validated;
        const { id } = params;
        const doc = await blueprintDbService.deleteOne(id);
        if (!doc) return res.status(404).json({ error: "Blueprint not found" });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: "Failed to delete blueprint", details: err });
    }
}