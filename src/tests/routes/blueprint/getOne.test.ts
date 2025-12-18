import request from "supertest";
import { app } from "@tests/setup";
import BlueprintModel from "@models/blueprint.model";
import TemplateModel from "@models/template.model";
import { MOCKED_DATA_STRUCTURE } from "@tests/mock/data/dataStrucutre";

describe("GET /api/blueprints/:id", () => {

    // =========================================================================
    // SUCCESS CASES (200)
    // =========================================================================

    it("should return 200 and the blueprint by ID", async () => {
        // Step 1: Create a blueprint
        const doc = await BlueprintModel.create({
            name: "Blueprint A",
            description: "Test description",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        // Step 2: Make GET request
        const res = await request(app).get(`/api/blueprints/${doc._id}`);

        // Step 3: Verify status code
        expect(res.status).toBe(200);

        // Step 4: Verify blueprint data
        expect(res.body).toMatchObject({
            _id: doc._id.toString(),
            name: "Blueprint A",
            description: "Test description",
            data_structure: MOCKED_DATA_STRUCTURE.text,
        });

        // Step 5: Verify timestamps exist
        expect(res.body).toHaveProperty("createdAt");
        expect(res.body).toHaveProperty("updatedAt");
    });

    it("should return 200 and blueprint with all data structure types", async () => {
        // Step 1: Create blueprint with complex data structure
        const doc = await BlueprintModel.create({
            name: "Complex Blueprint",
            description: "Blueprint with complex structure",
            data_structure: MOCKED_DATA_STRUCTURE.complex
        });

        // Step 2: Make GET request
        const res = await request(app).get(`/api/blueprints/${doc._id}`);

        // Step 3: Verify status code
        expect(res.status).toBe(200);

        // Step 4: Verify complex data structure is returned correctly
        expect(res.body.data_structure).toEqual(MOCKED_DATA_STRUCTURE.complex);
        expect(res.body.data_structure).toHaveProperty("report_title");
        expect(res.body.data_structure).toHaveProperty("author");
        expect(res.body.data_structure).toHaveProperty("sections");
    });

    it("should return 200 and blueprint without templates when withTemplates=false", async () => {
        // Step 1: Create blueprint
        const blueprint = await BlueprintModel.create({
            name: "Blueprint without templates",
            description: "Test",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        // Step 2: Create template linked to blueprint
        await TemplateModel.create({
            blueprint_id: blueprint._id,
            name: "Template 1",
            filename: "template1.docx",
            format: "docx",
            language: "EN",
            default: true
        });

        // Step 3: Make GET request without withTemplates query
        const res = await request(app).get(`/api/blueprints/${blueprint._id}`);

        // Step 4: Verify status code
        expect(res.status).toBe(200);

        // Step 5: Verify templates are not populated
        expect(res.body._id).toBe(blueprint._id.toString());
        expect(res.body.templates).toBeUndefined();
    });

    it("should return 200 and blueprint with populated templates when withTemplates=true", async () => {
        // Step 1: Create blueprint
        const blueprint = await BlueprintModel.create({
            name: "Blueprint with templates",
            description: "Test",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        // Step 2: Create templates linked to blueprint
        await TemplateModel.create([
            {
                blueprint_id: blueprint._id,
                name: "Template 1",
                filename: "template1.docx",
                format: "docx",
                language: "EN",
                default: true
            },
            {
                blueprint_id: blueprint._id,
                name: "Template 2",
                filename: "template2.docx",
                format: "docx",
                language: "FR",
                default: false
            }
        ]);

        // Step 3: Make GET request with withTemplates=true
        const res = await request(app).get(`/api/blueprints/${blueprint._id}?withTemplates=true`);

        // Step 4: Verify status code
        expect(res.status).toBe(200);

        // Step 5: Verify templates are populated
        expect(res.body._id).toBe(blueprint._id.toString());
        expect(res.body.templates).toBeDefined();
        expect(Array.isArray(res.body.templates)).toBe(true);
        expect(res.body.templates.length).toBe(2);

        // Step 6: Verify template data
        expect(res.body.templates[0]).toHaveProperty("name");
        expect(res.body.templates[0]).toHaveProperty("filename");
        expect(res.body.templates[0]).toHaveProperty("language");
    });

    // =========================================================================
    // ERROR CASES (404)
    // =========================================================================

    it("should return 404 when blueprint does not exist", async () => {
        // Step 1: Use a valid but non-existent MongoDB ObjectId
        const nonExistentId = "507f1f77bcf86cd799439011";

        // Step 2: Make GET request
        const res = await request(app).get(`/api/blueprints/${nonExistentId}`);

        // Step 3: Verify status code
        expect(res.status).toBe(404);

        // Step 4: Verify error message
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toBe("Blueprint not found");
    });

    it("should return 500 for invalid ObjectId format", async () => {
        // Step 1: Use invalid MongoDB ObjectId
        const invalidId = "invalid-id-123";

        // Step 2: Make GET request
        const res = await request(app).get(`/api/blueprints/${invalidId}`);

        // Step 3: Verify status code
        expect(res.status).toBe(500);
    });

    // =========================================================================
    // ERROR CASES (500)
    // =========================================================================

    it("should return 500 when database operation fails", async () => {
        // Step 1: Create a valid blueprint first
        const doc = await BlueprintModel.create({
            name: "Test Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        // Step 2: Spy on database findById method and mock error
        const findByIdSpy = jest.spyOn(BlueprintModel, 'findById').mockImplementationOnce(() => {
            throw new Error("Database read failed");
        });

        // Step 3: Make GET request
        const res = await request(app).get(`/api/blueprints/${doc._id}`);

        // Step 4: Verify error response
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error");
        expect(res.body).toHaveProperty("details");
        expect(res.body.error).toBe("Internal server error");
        expect(res.body.details).toContain("Database read failed");

        // Step 5: Restore spy
        findByIdSpy.mockRestore();
    });

});
