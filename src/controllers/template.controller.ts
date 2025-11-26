import { Request, Response } from "express";
import * as templateDbService from "../services/template.db.service";
import { templateFilesystemService } from "../services/template.filesytem.service";

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
        const doc = await templateDbService.getAll({}, {
            limit: limit ? Number(limit) : undefined,
            skip: skip ? Number(skip) : undefined,
            sort: sort ? JSON.parse(String(sort)) : undefined,
        });
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
        if (!req.file) {
            return res.status(400).json({ error: "File is required (key: file)" });
        }

        if (!req.body.data) {
            return res.status(400).json({ error: "Data is required (key: data)" });
        }

        const doc = await templateFilesystemService.createOne(JSON.parse(req.body.data), req.file);

        res.status(201).json(doc);
    } catch (err) {
        res.status(500).json({ error: "Failed to create template", details: err });
    }
}


export async function updateOne(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { file, body: { data } } = req

        const payload = data ? JSON.parse(data) : {};
        const doc = await templateFilesystemService.updateOne(id, payload, file);
        if (!doc) return res.status(404).json({ error: "Template not found" });
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: "Failed to update template", details: err });
    }
}

export async function deleteOne(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const doc = await templateDbService.deleteOne(id);
        if (!doc) return res.status(404).json({ error: "Template not found" });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: "Failed to delete template", details: err });
    }
}