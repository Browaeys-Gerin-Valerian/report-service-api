import { Request, Response } from "express";
import * as templateService from "../services/template.service";

export const templateController = {
    getAll,
    getOneById,
    createOne,
    updateOne,
    deleteOne,
};

export async function getAll(req: Request, res: Response) {
    try {
        const { limit, skip, sort } = req.query;
        const items = await templateService.getAll({}, {
            limit: limit ? Number(limit) : undefined,
            skip: skip ? Number(skip) : undefined,
            sort: sort ? JSON.parse(String(sort)) : undefined,
        });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: "Failed to list templates", details: err });
    }
}

export async function getOneById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const doc = await templateService.getOneById(id);
        if (!doc) return res.status(404).json({ error: "Template not found" });
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch template", details: err });
    }
}

export async function createOne(req: Request, res: Response) {
    try {
        const payload = req.body;
        if (!payload?.name || !payload?.template_file || !payload?.format) {
            return res.status(400).json({ error: "name, template_file and format are required" });
        }
        const doc = await templateService.createOne(payload);
        res.status(201).json(doc);
    } catch (err) {
        res.status(500).json({ error: "Failed to create template", details: err });
    }
}

export async function updateOne(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const updated = await templateService.updateOne(id, req.body);
        if (!updated) return res.status(404).json({ error: "Template not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Failed to update template", details: err });
    }
}

export async function deleteOne(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const deleted = await templateService.deleteOne(id);
        if (!deleted) return res.status(404).json({ error: "Template not found" });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: "Failed to delete template", details: err });
    }
}