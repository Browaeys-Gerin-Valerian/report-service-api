import request from "supertest";
import fs from "fs";
import path from "path";
import templateModel from "@models/template.model";
import { app, TEMPLATE_DIR } from "@tests/setup";

describe("DELETE /api/templates/:id", () => {

    it("should delete template and its file", async () => {
        const doc = await templateModel.create({
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: "Template A-1764257308.docx",
            name: "Template A",
            format: "pdf",
            language: "EN",
        });

        // Create a dummy file to simulate the template file
        const filePath = path.join(TEMPLATE_DIR, doc.filename);
        fs.writeFileSync(filePath, "dummy content");

        // Ensure file exists before delete
        expect(fs.existsSync(filePath)).toBe(true);

        // Delete the template
        const res = await request(app).delete(`/api/templates/${doc._id}`);
        expect(res.status).toBe(204);

        // Verify file is deleted
        expect(fs.existsSync(filePath)).toBe(false);

        // Verify template is deleted from DB
        const found = await templateModel.findById(doc._id);
        expect(found).toBeNull();
    });

    it("should return 404 if template not found", async () => {
        const res = await request(app).delete("/api/templates/650000000000000000000001");
        expect(res.status).toBe(404);
    });

    it("should handle missing file gracefully", async () => {
        const doc = await templateModel.create({
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: "Template B-1764257309.docx",
            name: "Template B",
            format: "docx",
            language: "EN",
        });

        // File does not exist
        const filePath = path.join(TEMPLATE_DIR, doc.filename);
        expect(fs.existsSync(filePath)).toBe(false);

        const res = await request(app).delete(`/api/templates/${doc._id}`);
        expect(res.status).toBe(204);

        // Ensure DB entry is deleted
        const found = await templateModel.findById(doc._id);
        expect(found).toBeNull();
    });

});
