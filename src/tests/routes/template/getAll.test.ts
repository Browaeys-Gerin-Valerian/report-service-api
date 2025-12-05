import request from "supertest";
import templateModel from "../../../models/template.model";
import { app } from "../../setup";
import { ITemplate } from "../../../types";

describe("GET /api/templates", () => {

    // --- Basic use case ---
    it("should return empty array if no templates exist", async () => {
        const res = await request(app).get("/api/templates");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it("should return all templates from the DB", async () => {
        await templateModel.create([
            { blueprint_id: "6928371bbe7c75459cc4a01d", filename: "Template A-1764257308.docx", name: "Template A", format: "docx", language: "EN" },
            { blueprint_id: "6928371fbe7c75459cc4a01f", filename: "Template B-1764257309.docx", name: "Template B", format: "pdf", language: "FR" },
        ]);

        const res = await request(app).get("/api/templates");
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
        expect(res.body.map((t: ITemplate) => t.name)).toEqual(expect.arrayContaining(["Template A", "Template B"]));
    });

    // --- Full Response ---
    it("should return templates with all expected fields", async () => {
        const doc = await templateModel.create({
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: "Full Template-1764257308.docx",
            name: "Full Template",
            format: "docx",
            language: "EN",
        });

        const res = await request(app).get("/api/templates");
        expect(res.status).toBe(200);
        expect(res.body[0]).toMatchObject({
            _id: doc._id.toString(),
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: "Full Template-1764257308.docx",
            name: "Full Template",
            format: "docx",
            language: "EN",
        });
    });

});
