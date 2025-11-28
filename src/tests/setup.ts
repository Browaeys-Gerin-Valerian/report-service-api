import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Application } from "express";
import fs from "fs";
import path from "path";
import { createApp } from "../app";
import { config } from "../config";
export const { TEMPLATE_DIR } = config;

export let app: Application;
let mongo: MongoMemoryServer;

beforeAll(async () => {
    // --- MongoDB In-Memory ---
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);

    // --- Express App ---
    app = createApp();

    // --- Templates Directory ---
    if (!fs.existsSync(TEMPLATE_DIR)) {
        fs.mkdirSync(TEMPLATE_DIR, { recursive: true });
    }
});

afterEach(async () => {
    // --- Nettoyage DB ---
    const db = mongoose.connection.db;
    if (db) {
        const collections = await db.collections();
        for (const collection of collections) {
            await collection.deleteMany({});
        }
    }

    // --- Nettoyage du dossier Templates ---
    const files = fs.existsSync(TEMPLATE_DIR) ? fs.readdirSync(TEMPLATE_DIR) : [];
    await Promise.all(files.map(async file => {
        const filePath = path.join(TEMPLATE_DIR, file);
        try {
            await fs.promises.unlink(filePath);
        } catch (err: any) {
            if (err.code !== "ENOENT") {
                throw err;
            }
        }
    }));

});

afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
});
