import { Request, Response } from "express";
import * as blueprintDbService from "../services/blueprint.db.service";


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
        const doc = await blueprintDbService.getAll({}, {
            limit: limit ? Number(limit) : undefined,
            skip: skip ? Number(skip) : undefined,
            sort: sort ? JSON.parse(String(sort)) : undefined,
        });
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: "Failed to list blueprints", details: err });
    }
}

export async function getOneById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const doc = await blueprintDbService.getOneById(id);
        if (!doc) return res.status(404).json({ error: "Blueprint not found" });
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch blueprint", details: err });
    }
}

export async function createOne(req: Request, res: Response) {
    try {
        const { data } = req.body;
        const doc = await blueprintDbService.createOne(JSON.parse(data));
        res.status(201).json(doc);
    } catch (err) {
        res.status(500).json({ error: "Failed to create blueprint", details: err });
    }
}

export async function updateOne(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { data } = req.body;

        const doc = await blueprintDbService.updateOne(id, JSON.parse(data));
        if (!doc) return res.status(404).json({ error: "Blueprint not found" });
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: "Failed to update blueprint", details: err });
    }
}

export async function deleteOne(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const doc = await blueprintDbService.deleteOne(id);
        if (!doc) return res.status(404).json({ error: "Blueprint not found" });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: "Failed to delete blueprint", details: err });
    }
}