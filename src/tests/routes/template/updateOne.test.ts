import request from "supertest";
import fs from "fs";
import path from "path";
import templateModel from "../../../models/template.model";
import { app, TEMPLATE_DIR } from "../../setup";

describe("PATCH /api/templates/:id", () => {

    // --------------------------------------------------------------------
    // 1️⃣ PATCH avec uniquement DATA
    // --------------------------------------------------------------------
    it.skip("should update fields and rename file if name is updated (data only)", async () => {
        //
        // --- ARRANGE : créer un template initial ---
        //
        const initialFile = Buffer.from("initial content");
        const createRes = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: "6928371bbe7c75459cc4a01d",
                name: "Initial Template",
                language: "EN"
            }))
            .attach("file", initialFile, "initial.docx");

        const templateId = createRes.body._id;
        const oldFilename = createRes.body.filename;
        const oldFilePath = path.join(TEMPLATE_DIR, oldFilename);

        //
        // --- ACT : PATCH only with data ---
        //
        const patchRes = await request(app)
            .patch(`/api/templates/${templateId}`)
            .field("data", JSON.stringify({
                name: "Updated Template",
                default: true,
                language: "FR"
            }));

        expect(patchRes.status).toBe(200);

        //
        // --- ASSERT DB ---
        //
        const doc = await templateModel.findById(templateId).lean();

        expect(doc?.name).toBe("Updated Template");
        expect(doc?.default).toBe(true);
        expect(doc?.language).toBe("FR");
        expect(doc?.format).toBe("docx");
        expect(doc?.filename).toMatch(/^Updated Template-\d+\.docx$/);

        //
        // --- ASSERT FILESYSTEM ---
        //
        const newFilePath = path.join(TEMPLATE_DIR, doc!.filename);

        expect(fs.existsSync(oldFilePath)).toBe(false);
        expect(fs.existsSync(newFilePath)).toBe(true);
    });

    // --------------------------------------------------------------------
    // 2️⃣ PATCH avec uniquement FILE
    // --------------------------------------------------------------------
    it.skip("should replace file and update filename when only file is sent", async () => {
        //
        // --- ARRANGE : créer un template initial ---
        //
        const initialFile = Buffer.from("initial content");
        const createRes = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: "6928371bbe7c75459cc4a01d",
                name: "Initial Template",
                language: "EN"
            }))
            .attach("file", initialFile, "initial.docx");

        const templateId = createRes.body._id;
        const oldFilename = createRes.body.filename;
        const oldFilePath = path.join(TEMPLATE_DIR, oldFilename);

        //
        // --- ACT : PATCH only with FILE ---
        //
        const newFile = Buffer.from("new content");
        const patchRes = await request(app)
            .patch(`/api/templates/${templateId}`)
            .attach("file", newFile, "updated.docx");

        expect(patchRes.status).toBe(200);

        //
        // --- ASSERT DB ---
        //
        const doc = await templateModel.findById(templateId).lean();

        expect(doc?.name).toBe("Initial Template");
        expect(doc?.format).toBe("docx");
        expect(doc?.filename).toMatch(/^Initial Template-\d+\.docx$/);

        //
        // --- ASSERT FILESYSTEM ---
        //
        const newFilePath = path.join(TEMPLATE_DIR, doc!.filename);

        expect(fs.existsSync(oldFilePath)).toBe(false);
        expect(fs.existsSync(newFilePath)).toBe(true);
    });

    // --------------------------------------------------------------------
    // 3️⃣ PATCH with DATA + FILE
    // --------------------------------------------------------------------
    it.skip("should update fields and replace+rename file when both data and file are sent", async () => {
        //
        // --- ARRANGE : créer un template initial ---
        //
        const initialFile = Buffer.from("initial content");
        const createRes = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: "6928371bbe7c75459cc4a01d",
                name: "Initial Template",
                language: "EN"
            }))
            .attach("file", initialFile, "initial.docx");

        const templateId = createRes.body._id;
        const oldFilename = createRes.body.filename;
        const oldFilePath = path.join(TEMPLATE_DIR, oldFilename);

        //
        // --- ACT : PATCH avec data + file ---
        //
        const newFile = Buffer.from("brand new file");
        const patchRes = await request(app)
            .patch(`/api/templates/${templateId}`)
            .field("data", JSON.stringify({
                name: "Final Template",
                language: "ES",
                default: true
            }))
            .attach("file", newFile, "updated.docx");

        expect(patchRes.status).toBe(200);

        //
        // --- ASSERT DB ---
        //
        const doc = await templateModel.findById(templateId).lean();

        expect(doc?.name).toBe("Final Template");
        expect(doc?.language).toBe("ES");
        expect(doc?.default).toBe(true);
        expect(doc?.format).toBe("docx");
        expect(doc?.filename).toMatch(/^Final Template-\d+\.docx$/);

        //
        // --- ASSERT FILESYSTEM ---
        //
        const newFilePath = path.join(TEMPLATE_DIR, doc!.filename);

        expect(fs.existsSync(oldFilePath)).toBe(false);
        expect(fs.existsSync(newFilePath)).toBe(true);
    });

});
