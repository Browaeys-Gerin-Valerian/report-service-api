import request from "supertest";
import fs from "fs";
import path from "path";
import templateModel from "@models/template.model";
import BlueprintModel from "@models/blueprint.model";
import { app, TEMPLATE_DIR } from "@tests/setup";
import { MOCKED_DATA_STRUCTURE } from "@tests/mock/data/dataStrucutre";

describe("DELETE /api/templates/:id", () => {

    // =========================================================================
    // SUCCESS CASES (204)
    // =========================================================================

    it("should return 204 and delete template with its file", async () => {
        // Step 1: Create template
        const doc = await templateModel.create({
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: "Template A-1764257308.docx",
            name: "Template A",
            format: "docx",
            language: "EN",
            supported_output_formats: ["pdf", "docx"]
        });

        // Step 2: Create dummy file to simulate template file
        const filePath = path.join(TEMPLATE_DIR, doc.filename);
        fs.writeFileSync(filePath, "dummy content");

        // Step 3: Verify file exists before deletion
        expect(fs.existsSync(filePath)).toBe(true);

        // Step 4: Delete template
        const res = await request(app).delete(`/api/templates/${doc._id}`);

        // Step 5: Verify status code
        expect(res.status).toBe(204);

        // Step 6: Verify response body is empty
        expect(res.body).toEqual({});

        // Step 7: Verify file is deleted from disk
        expect(fs.existsSync(filePath)).toBe(false);

        // Step 8: Verify template is deleted from database
        const found = await templateModel.findById(doc._id);
        expect(found).toBeNull();
    });

    it("should return 204 and handle missing file gracefully", async () => {
        // Step 1: Create template without creating physical file
        const doc = await templateModel.create({
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: "Template B-1764257309.docx",
            name: "Template B",
            format: "docx",
            language: "EN",
            supported_output_formats: ["pdf"]
        });

        // Step 2: Verify file does not exist
        const filePath = path.join(TEMPLATE_DIR, doc.filename);
        expect(fs.existsSync(filePath)).toBe(false);

        // Step 3: Delete template
        const res = await request(app).delete(`/api/templates/${doc._id}`);

        // Step 4: Verify successful deletion
        expect(res.status).toBe(204);

        // Step 5: Verify database entry is deleted
        const found = await templateModel.findById(doc._id);
        expect(found).toBeNull();
    });

    it("should return 204 and delete template with different formats", async () => {
        // Step 1: Create DOCX template
        const docx = await templateModel.create({
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: "template.docx",
            name: "DOCX Template",
            format: "docx",
            language: "EN",
            supported_output_formats: ["pdf", "docx"]
        });

        const docxPath = path.join(TEMPLATE_DIR, docx.filename);
        fs.writeFileSync(docxPath, "docx content");

        // Step 2: Delete DOCX template
        const resDocx = await request(app).delete(`/api/templates/${docx._id}`);
        expect(resDocx.status).toBe(204);
        expect(fs.existsSync(docxPath)).toBe(false);
    });

    it("should return 204 and delete multiple templates independently", async () => {
        // Step 1: Create multiple templates
        const template1 = await templateModel.create({
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: "template-1.docx",
            name: "Template 1",
            format: "docx",
            language: "EN",
            supported_output_formats: ["pdf"]
        });

        const template2 = await templateModel.create({
            blueprint_id: "6928371fbe7c75459cc4a01f",
            filename: "template-2.docx",
            name: "Template 2",
            format: "docx",
            language: "FR",
            supported_output_formats: ["pdf", "docx"]
        });

        // Step 2: Create files
        const file1 = path.join(TEMPLATE_DIR, template1.filename);
        const file2 = path.join(TEMPLATE_DIR, template2.filename);
        fs.writeFileSync(file1, "content1");
        fs.writeFileSync(file2, "content2");

        // Step 3: Delete first template
        const res1 = await request(app).delete(`/api/templates/${template1._id}`);
        expect(res1.status).toBe(204);

        // Step 4: Verify second template still exists in database
        const template2Exists = await templateModel.findById(template2._id);
        expect(template2Exists).not.toBeNull();

        // Step 5: Delete second template
        const res2 = await request(app).delete(`/api/templates/${template2._id}`);
        expect(res2.status).toBe(204);
    });

    it("should return 204 and delete template associated with blueprint", async () => {
        // Step 1: Create blueprint
        const blueprint = await BlueprintModel.create({
            name: "Test Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        // Step 2: Create template for blueprint
        const template = await templateModel.create({
            blueprint_id: blueprint._id,
            filename: "blueprint-template.docx",
            name: "Blueprint Template",
            format: "docx",
            language: "EN",
            supported_output_formats: ["pdf"]
        });

        const filePath = path.join(TEMPLATE_DIR, template.filename);
        fs.writeFileSync(filePath, "content");

        // Step 3: Delete template
        const res = await request(app).delete(`/api/templates/${template._id}`);

        // Step 4: Verify deletion
        expect(res.status).toBe(204);
        expect(fs.existsSync(filePath)).toBe(false);

        // Step 5: Verify blueprint still exists
        const blueprintExists = await BlueprintModel.findById(blueprint._id);
        expect(blueprintExists).not.toBeNull();
    });

    it("should return 204 and delete template with special characters in filename", async () => {
        // Step 1: Create template with special characters
        const doc = await templateModel.create({
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: "Template-With-Dashes-123.docx",
            name: "Special Template",
            format: "docx",
            language: "EN",
            supported_output_formats: ["pdf"]
        });

        const filePath = path.join(TEMPLATE_DIR, doc.filename);
        fs.writeFileSync(filePath, "content");

        // Step 2: Delete template
        const res = await request(app).delete(`/api/templates/${doc._id}`);

        // Step 3: Verify deletion
        expect(res.status).toBe(204);
        expect(fs.existsSync(filePath)).toBe(false);
    });

    // =========================================================================
    // ERROR CASES (404)
    // =========================================================================

    it("should return 404 when template does not exist", async () => {
        // Step 1: Use valid but non-existent ObjectId
        const nonExistentId = "507f1f77bcf86cd799439011";

        // Step 2: Make DELETE request
        const res = await request(app).delete(`/api/templates/${nonExistentId}`);

        // Step 3: Verify status code
        expect(res.status).toBe(404);

        // Step 4: Verify error message
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toBe("Template not found");
    });

    it("should return 404 when trying to delete already deleted template", async () => {
        // Step 1: Create template
        const doc = await templateModel.create({
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: "template.docx",
            name: "To Delete Twice",
            format: "docx",
            language: "EN",
            supported_output_formats: ["pdf"]
        });

        const filePath = path.join(TEMPLATE_DIR, doc.filename);
        fs.writeFileSync(filePath, "content");

        // Step 2: Delete template first time
        const firstDelete = await request(app).delete(`/api/templates/${doc._id}`);
        expect(firstDelete.status).toBe(204);

        // Step 3: Try to delete again
        const secondDelete = await request(app).delete(`/api/templates/${doc._id}`);

        // Step 4: Verify 404 error
        expect(secondDelete.status).toBe(404);
        expect(secondDelete.body.error).toBe("Template not found");
    });

    // =========================================================================
    // ERROR CASES (500)
    // =========================================================================

    it("should return 500 for invalid ObjectId format", async () => {
        // Step 1: Use invalid ObjectId
        const invalidId = "invalid-id-format";

        // Step 2: Make DELETE request
        const res = await request(app).delete(`/api/templates/${invalidId}`);

        // Step 3: Verify validation error
        expect(res.status).toBe(500);
    });

    it("should return 500 when database operation fails", async () => {
        // Step 1: Create template
        const doc = await templateModel.create({
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: "template.docx",
            name: "Test Template",
            format: "docx",
            language: "EN",
            supported_output_formats: ["pdf"]
        });

        // Step 2: Spy on database delete method and mock error
        const deleteSpy = jest.spyOn(templateModel, 'findByIdAndDelete').mockImplementationOnce(() => {
            throw new Error("Database deletion failed");
        });

        // Step 3: Make DELETE request
        const res = await request(app).delete(`/api/templates/${doc._id}`);

        // Step 4: Verify error response
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error");
        expect(res.body).toHaveProperty("details");
        expect(res.body.error).toBe("Internal server error");
        expect(res.body.details).toContain("Database deletion failed");

        // Step 5: Restore spy
        deleteSpy.mockRestore();
    });

});

