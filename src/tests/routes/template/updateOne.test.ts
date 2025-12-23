import request from "supertest";
import fs from "fs";
import path from "path";
import templateModel from "@models/template.model";
import { app, TEMPLATE_DIR } from "@tests/setup";
import BlueprintModel from "@models/blueprint.model";
import { MOCKED_DATA_STRUCTURE } from "@tests/mock/data/dataStrucutre";

describe("PATCH /api/templates/:id", () => {

    // =========================================================================
    // SUCCESS CASES (200)
    // =========================================================================

    it("should return 200 and update name only", async () => {
        // Step 1: Create blueprint
        const blueprint = await BlueprintModel.create({
            name: "Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        // Step 2: Create initial template
        const createRes = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: blueprint._id.toString(),
                name: "Old Name",
                language: "EN"
            }))
            .attach("file", Buffer.from("content"), "template.docx");

        const templateId = createRes.body._id;
        const originalFilename = createRes.body.filename;

        // Step 3: Update name only
        const res = await request(app)
            .patch(`/api/templates/${templateId}`)
            .field("data", JSON.stringify({ name: "New Name" }));

        // Step 4: Verify status code
        expect(res.status).toBe(200);

        // Step 5: Verify response data
        expect(res.body.name).toBe("New Name");
        expect(res.body.language).toBe("EN");
        // Note: Filename is regenerated when name changes
        expect(res.body.filename).toMatch(/^New Name-\d+\.docx$/);
        expect(res.body.filename).not.toBe(originalFilename);

        // Step 6: Verify database persistence
        const doc = await templateModel.findById(templateId);
        expect(doc?.name).toBe("New Name");

        // Cleanup - clean both old and new files
        const oldFilePath = path.join(TEMPLATE_DIR, originalFilename);
        const newFilePath = path.join(TEMPLATE_DIR, res.body.filename);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
        if (fs.existsSync(newFilePath)) fs.unlinkSync(newFilePath);
    });

    it("should return 200 and update language only", async () => {
        // Step 1: Create blueprint and template
        const blueprint = await BlueprintModel.create({
            name: "Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        const createRes = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: blueprint._id.toString(),
                name: "Template",
                language: "EN"
            }))
            .attach("file", Buffer.from("content"), "template.docx");

        const templateId = createRes.body._id;
        const filename = createRes.body.filename;

        // Step 2: Update language
        const res = await request(app)
            .patch(`/api/templates/${templateId}`)
            .field("data", JSON.stringify({ language: "FR" }));

        // Step 3: Verify language updated
        expect(res.status).toBe(200);
        expect(res.body.language).toBe("FR");
        expect(res.body.name).toBe("Template");

        // Cleanup
        const filePath = path.join(TEMPLATE_DIR, filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    it("should return 200 and replace file only without data changes", async () => {
        // Step 1: Create blueprint and template
        const blueprint = await BlueprintModel.create({
            name: "Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        const createRes = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: blueprint._id.toString(),
                name: "Template",
                language: "EN"
            }))
            .attach("file", Buffer.from("initial content"), "initial.docx");

        const templateId = createRes.body._id;
        const oldFilename = createRes.body.filename;
        const oldFilePath = path.join(TEMPLATE_DIR, oldFilename);

        // Step 2: Replace file only
        const res = await request(app)
            .patch(`/api/templates/${templateId}`)
            .attach("file", Buffer.from("new content"), "updated.docx");

        // Step 3: Verify status and data unchanged
        expect(res.status).toBe(200);
        expect(res.body.name).toBe("Template");
        expect(res.body.language).toBe("EN");

        // Step 4: Verify filename updated with timestamp
        expect(res.body.filename).toMatch(/^Template-\d+\.docx$/);
        expect(res.body.filename).not.toBe(oldFilename);
    });

    it("should return 200 and update data and replace file simultaneously", async () => {
        // Step 1: Create blueprint and template
        const blueprint = await BlueprintModel.create({
            name: "Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        const createRes = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: blueprint._id.toString(),
                name: "Initial Template",
                language: "EN"
            }))
            .attach("file", Buffer.from("initial"), "initial.docx");

        const templateId = createRes.body._id;
        const oldFilename = createRes.body.filename;
        const oldFilePath = path.join(TEMPLATE_DIR, oldFilename);

        // Step 2: Update data and file
        const res = await request(app)
            .patch(`/api/templates/${templateId}`)
            .field("data", JSON.stringify({
                name: "Final Template",
                language: "ES"
            }))
            .attach("file", Buffer.from("new content"), "updated.docx");

        // Step 3: Verify data updated
        expect(res.status).toBe(200);
        expect(res.body.name).toBe("Final Template");
        expect(res.body.language).toBe("ES");

        // Step 4: Verify filename updated with new name
        expect(res.body.filename).toMatch(/^Final Template-\d+\.docx$/);

        // Step 5: Verify database persistence
        const doc = await templateModel.findById(templateId);
        expect(doc?.name).toBe("Final Template");
        expect(doc?.language).toBe("ES");
    });

    it("should return 200 and update multiple fields at once", async () => {
        // Step 1: Create blueprint and template
        const blueprint = await BlueprintModel.create({
            name: "Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        const createRes = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: blueprint._id.toString(),
                name: "Old Name",
                language: "EN"
            }))
            .attach("file", Buffer.from("content"), "template.docx");

        const templateId = createRes.body._id;
        const filename = createRes.body.filename;

        // Step 2: Update multiple fields
        const res = await request(app)
            .patch(`/api/templates/${templateId}`)
            .field("data", JSON.stringify({
                name: "Updated Name",
                language: "FR"
            }));

        // Step 3: Verify all fields updated
        expect(res.status).toBe(200);
        expect(res.body.name).toBe("Updated Name");
        expect(res.body.language).toBe("FR");

        // Cleanup
        const filePath = path.join(TEMPLATE_DIR, filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    it("should return 200 and handle empty update (no changes)", async () => {
        // Step 1: Create blueprint and template
        const blueprint = await BlueprintModel.create({
            name: "Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        const createRes = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: blueprint._id.toString(),
                name: "Template",
                language: "EN"
            }))
            .attach("file", Buffer.from("content"), "template.docx");

        const templateId = createRes.body._id;
        const filename = createRes.body.filename;

        // Step 2: Update with empty data
        const res = await request(app)
            .patch(`/api/templates/${templateId}`)
            .field("data", JSON.stringify({}));

        // Step 3: Verify no changes
        expect(res.status).toBe(200);
        expect(res.body.name).toBe("Template");
        expect(res.body.language).toBe("EN");

        // Cleanup
        const filePath = path.join(TEMPLATE_DIR, filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    it("should return 200 and update language to different values", async () => {
        // Step 1: Create blueprint and template
        const blueprint = await BlueprintModel.create({
            name: "Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        const createRes = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: blueprint._id.toString(),
                name: "Multi-Language Template",
                language: "EN"
            }))
            .attach("file", Buffer.from("content"), "template.docx");

        const templateId = createRes.body._id;
        const filename = createRes.body.filename;

        const languages = ["FR", "ES", "DE", "EN"];

        // Step 2: Update language multiple times
        for (const language of languages) {
            const res = await request(app)
                .patch(`/api/templates/${templateId}`)
                .field("data", JSON.stringify({ language }));

            expect(res.status).toBe(200);
            expect(res.body.language).toBe(language);
        }

        // Cleanup
        const filePath = path.join(TEMPLATE_DIR, filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    // =========================================================================
    // ERROR CASES (404)
    // =========================================================================

    it("should return 404 when template does not exist", async () => {
        // Step 1: Use valid but non-existent ObjectId
        const nonExistentId = "507f1f77bcf86cd799439011";

        // Step 2: Make PATCH request
        const res = await request(app)
            .patch(`/api/templates/${nonExistentId}`)
            .field("data", JSON.stringify({ name: "Updated" }));

        // Step 3: Verify status code
        expect(res.status).toBe(404);

        // Step 4: Verify error message
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toBe("Template not found");
    });

    // =========================================================================
    // ERROR CASES (500)
    // =========================================================================

    it("should return 500 for invalid ObjectId format", async () => {
        // Step 1: Use invalid ObjectId
        const invalidId = "invalid-id-format";

        // Step 2: Make PATCH request
        const res = await request(app)
            .patch(`/api/templates/${invalidId}`)
            .field("data", JSON.stringify({ name: "Updated" }));

        // Step 3: Verify validation error
        expect(res.status).toBe(500);
    });

    it("should return 500 when database operation fails", async () => {
        // Step 1: Create blueprint and template
        const blueprint = await BlueprintModel.create({
            name: "Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        const createRes = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: blueprint._id.toString(),
                name: "Template",
                language: "EN"
            }))
            .attach("file", Buffer.from("content"), "template.docx");

        const templateId = createRes.body._id;
        const filename = createRes.body.filename;

        // Step 2: Spy on database method and mock error
        const findSpy = jest.spyOn(templateModel, 'findById').mockImplementationOnce(() => {
            throw new Error("Database query failed");
        });

        // Step 3: Make PATCH request
        const res = await request(app)
            .patch(`/api/templates/${templateId}`)
            .field("data", JSON.stringify({ name: "Updated" }));

        // Step 4: Verify error response
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error");
        expect(res.body).toHaveProperty("details");
        expect(res.body.error).toBe("Internal server error");
        expect(res.body.details).toContain("Database query failed");

        // Step 5: Restore spy and cleanup
        findSpy.mockRestore();
        const filePath = path.join(TEMPLATE_DIR, filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

});

