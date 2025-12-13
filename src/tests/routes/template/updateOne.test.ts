import request from "supertest";
import fs from "fs";
import path from "path";
import templateModel from "@models/template.model";
import { app, TEMPLATE_DIR } from "@tests/setup";
import BlueprintModel from "@models/blueprint.model";
import { MOCKED_DATA_STRUCTURE } from "@tests/mock/data/dataStrucutre";

describe("PATCH /api/templates/:id", () => {
    let blueprintId: string;

    // Centralized blueprint creation before each test
    beforeEach(async () => {
        const blueprint = await BlueprintModel.create({
            name: "Blueprint 1",
            description: "This is the first blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });
        blueprintId = blueprint._id.toString();
    });


    it("should replace file and update filename when only file is sent", async () => {
        const initialFile = Buffer.from("initial content");
        const template = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: blueprintId,
                name: "Initial Template",
                language: "EN"
            }))
            .attach("file", initialFile, "initial.docx");

        const templateId = template.body._id;
        const oldFilename = template.body.filename;
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


    it("should update fields and replace+rename file when both data and file are sent", async () => {
        const initialFile = Buffer.from("initial content");
        const createRes = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: blueprintId,
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
