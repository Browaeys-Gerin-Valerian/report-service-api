import { Request, Response } from "express";
import * as blueprintService from "../services/blueprint.service";
import { json } from "stream/consumers";


export const blueprintController = {
    getAll,
    getOneById,
    createOne,
    updateOne,
    deleteOne,
};


export async function getAll(req: Request, res: Response) {
    try {
        const { limit, skip, sort } = req.query;
        const items = await blueprintService.getAll({}, {
            limit: limit ? Number(limit) : undefined,
            skip: skip ? Number(skip) : undefined,
            sort: sort ? JSON.parse(String(sort)) : undefined,
        });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: "Failed to list blueprints", details: err });
    }
}

export async function getOneById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const doc = await blueprintService.getOneById(id);
        if (!doc) return res.status(404).json({ error: "Blueprint not found" });
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch blueprint", details: err });
    }
}

export async function createOne(req: Request, res: Response) {
    try {
        const { data } = req.body;
        const doc = await blueprintService.createOne(JSON.parse(data));
        res.status(201).json(doc);
    } catch (err) {
        res.status(500).json({ error: "Failed to create blueprint", details: err });
    }
}

export async function updateOne(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { data } = req.body;

        const updated = await blueprintService.updateOne(id, JSON.parse(data));
        if (!updated) return res.status(404).json({ error: "Blueprint not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Failed to update blueprint", details: err });
    }
}

export async function deleteOne(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const deleted = await blueprintService.deleteOne(id);
        if (!deleted) return res.status(404).json({ error: "Blueprint not found" });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: "Failed to delete blueprint", details: err });
    }
}