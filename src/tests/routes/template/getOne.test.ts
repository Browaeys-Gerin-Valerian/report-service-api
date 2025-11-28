import request from "supertest";
import { app } from "../../setup";
import templateModel from "../../../models/template.model";



describe("GET /api/templates/:id", () => {

    // --- Basic use case ---
    it("should return the template by ID", async () => {
        const doc = await templateModel.create({
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: "Template A-1764257308.docx",
            name: "Template A",
            format: "pdf",
            language: "EN",
        });

        const res = await request(app).get(`/api/templates/${doc._id}`);
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            _id: doc._id.toString(),
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: "Template A-1764257308.docx",
            name: "Template A",
            format: "pdf",
            language: "EN",
        });
    });

    // --- error use case ---
    it("should return 404 if template not found", async () => {
        const res = await request(app).get("/api/templates/6928371bbe7c75459cc4a01d");
        expect(res.status).toBe(404); // Template does not exist
    });


});