import request from "supertest";
import fs from "fs";
import path from "path";
import { app, TEMPLATE_DIR } from "@tests/setup";
import BlueprintModel from "@models/blueprint.model";
import templateModel from "@models/template.model";
import { MOCKED_DATA_STRUCTURE } from "@tests/mock/data/dataStrucutre";

describe("GET /api/templates/:id/analyze", () => {

    // =========================================================================
    // NOTE: Success cases with status 200 would require valid DOCX files
    // which are complex to create in tests. The analyzer endpoint flow is tested
    // through error cases which validate the controller logic.
    // =========================================================================

    // =========================================================================
    // ERROR CASES (404)
    // =========================================================================

    it("should return 404 when template does not exist", async () => {
        // Step 1: Use valid but non-existent ObjectId
        const nonExistentId = "507f1f77bcf86cd799439011";

        // Step 2: Make GET request
        const res = await request(app).get(`/api/templates/${nonExistentId}/analyze`);

        // Step 3: Verify status code
        expect(res.status).toBe(404);

        // Step 4: Verify error message
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toBe("Template not found");
    });

    it("should return 404 when blueprint does not exist", async () => {
        // Step 1: Create template with non-existent blueprint_id
        const template = await templateModel.create({
            blueprint_id: "507f1f77bcf86cd799439011",
            filename: "template.docx",
            name: "Orphan Template",
            format: "docx",
            language: "EN",
            supported_output_formats: ["pdf"]
        });

        // Step 2: Create physical file
        const filePath = path.join(TEMPLATE_DIR, template.filename);
        fs.writeFileSync(filePath, "content");

        // Step 3: Try to analyze
        const res = await request(app).get(`/api/templates/${template._id}/analyze`);

        // Step 4: Verify error
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toBe("Blueprint not found");

        // Cleanup
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    // =========================================================================
    // ERROR CASES (500)
    // =========================================================================

    it("should return 500 for invalid ObjectId format", async () => {
        // Step 1: Use invalid ObjectId
        const invalidId = "invalid-id-format";

        // Step 2: Make GET request
        const res = await request(app).get(`/api/templates/${invalidId}/analyze`);

        // Step 3: Verify validation error
        expect(res.status).toBe(500);
    });

    it("should return 500 when template file is missing", async () => {
        // Step 1: Create blueprint
        const blueprint = await BlueprintModel.create({
            name: "Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        // Step 2: Create template in DB without physical file
        const template = await templateModel.create({
            blueprint_id: blueprint._id,
            filename: "missing-file.docx",
            name: "Missing File Template",
            format: "docx",
            language: "EN",
            supported_output_formats: ["pdf"]
        });

        // Step 3: Try to analyze (file doesn't exist)
        const res = await request(app).get(`/api/templates/${template._id}/analyze`);

        // Step 4: Verify error
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error");
    });

    it("should return 500 when template file is not a valid DOCX", async () => {
        // Step 1: Create blueprint
        const blueprint = await BlueprintModel.create({
            name: "Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        // Step 2: Create template
        const createRes = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: blueprint._id.toString(),
                name: "Invalid DOCX",
                language: "EN"
            }))
            .attach("file", Buffer.from("not a valid docx file"), "template.docx");

        const templateId = createRes.body._id;

        // Step 3: Try to analyze invalid DOCX
        const res = await request(app).get(`/api/templates/${templateId}/analyze`);

        // Step 4: Verify error (analyzer can't parse invalid DOCX)
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error");

        // Cleanup
        const filePath = path.join(TEMPLATE_DIR, createRes.body.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
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

        // Step 2: Spy on database method and mock error
        const findSpy = jest.spyOn(templateModel, 'findById').mockImplementationOnce(() => {
            throw new Error("Database query failed");
        });

        // Step 3: Make GET request
        const res = await request(app).get(`/api/templates/${templateId}/analyze`);

        // Step 4: Verify error response
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error");
        expect(res.body).toHaveProperty("details");
        expect(res.body.error).toBe("Internal server error");
        expect(res.body.details).toContain("Database query failed");

        // Step 5: Restore spy and cleanup
        findSpy.mockRestore();
        const filePath = path.join(TEMPLATE_DIR, createRes.body.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

});

