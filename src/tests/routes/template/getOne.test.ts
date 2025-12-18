import request from "supertest";
import { app } from "@tests/setup";
import templateModel from "@models/template.model";
import BlueprintModel from "@models/blueprint.model";
import { MOCKED_DATA_STRUCTURE } from "@tests/mock/data/dataStrucutre";

describe("GET /api/templates/:id", () => {

    // =========================================================================
    // SUCCESS CASES (200)
    // =========================================================================

    it("should return 200 and template by ID", async () => {
        // Step 1: Create template
        const doc = await templateModel.create({
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: "Template A-1764257308.docx",
            name: "Template A",
            format: "docx",
            language: "EN",
            supported_output_formats: ["pdf", "docx"]
        });

        // Step 2: Make GET request
        const res = await request(app).get(`/api/templates/${doc._id}`);

        // Step 3: Verify status code
        expect(res.status).toBe(200);

        // Step 4: Verify response data
        expect(res.body).toMatchObject({
            _id: doc._id.toString(),
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: "Template A-1764257308.docx",
            name: "Template A",
            format: "docx",
            language: "EN",
            supported_output_formats: ["pdf", "docx"]
        });
    });

    it("should return 200 and template with all expected fields", async () => {
        // Step 1: Create template with all fields
        const doc = await templateModel.create({
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: "Full Template-1764257308.docx",
            name: "Full Template",
            format: "docx",
            language: "EN",
            supported_output_formats: ["pdf"]
        });

        // Step 2: Make GET request
        const res = await request(app).get(`/api/templates/${doc._id}`);

        // Step 3: Verify status code
        expect(res.status).toBe(200);

        // Step 4: Verify all fields present
        expect(res.body).toHaveProperty("_id");
        expect(res.body).toHaveProperty("blueprint_id");
        expect(res.body).toHaveProperty("filename");
        expect(res.body).toHaveProperty("name");
        expect(res.body).toHaveProperty("format");
        expect(res.body).toHaveProperty("language");
        expect(res.body).toHaveProperty("supported_output_formats");
        expect(res.body).toHaveProperty("createdAt");
        expect(res.body).toHaveProperty("updatedAt");
    });

    it("should return 200 and template with DOCX format", async () => {
        // Step 1: Create DOCX template
        const doc = await templateModel.create({
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: "template.docx",
            name: "DOCX Template",
            format: "docx",
            language: "EN",
            supported_output_formats: ["pdf", "docx"]
        });

        // Step 2: Make GET request
        const res = await request(app).get(`/api/templates/${doc._id}`);

        // Step 3: Verify format
        expect(res.status).toBe(200);
        expect(res.body.format).toBe("docx");
    });

    it("should return 200 and template with different languages", async () => {
        const languages = ["EN", "FR", "ES", "DE"];

        for (const language of languages) {
            // Step 1: Create template with specific language
            const doc = await templateModel.create({
                blueprint_id: "6928371bbe7c75459cc4a01d",
                filename: `template-${language}.docx`,
                name: `Template ${language}`,
                format: "docx",
                language,
                supported_output_formats: ["pdf"]
            });

            // Step 2: Make GET request
            const res = await request(app).get(`/api/templates/${doc._id}`);

            // Step 3: Verify language
            expect(res.status).toBe(200);
            expect(res.body.language).toBe(language);
        }
    });

    it("should return 200 and template with different supported output formats", async () => {
        // Step 1: Create template with PDF only
        const doc1 = await templateModel.create({
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: "template-pdf.docx",
            name: "PDF Only",
            format: "docx",
            language: "EN",
            supported_output_formats: ["pdf"]
        });

        // Step 2: Create template with both formats
        const doc2 = await templateModel.create({
            blueprint_id: "6928371fbe7c75459cc4a01f",
            filename: "template-both.docx",
            name: "Both Formats",
            format: "docx",
            language: "EN",
            supported_output_formats: ["pdf", "docx"]
        });

        // Step 3: Verify PDF only template
        const res1 = await request(app).get(`/api/templates/${doc1._id}`);
        expect(res1.status).toBe(200);
        expect(res1.body.supported_output_formats).toEqual(["pdf"]);

        // Step 4: Verify both formats template
        const res2 = await request(app).get(`/api/templates/${doc2._id}`);
        expect(res2.status).toBe(200);
        expect(res2.body.supported_output_formats).toEqual(["pdf", "docx"]);
    });

    it("should return 200 and template associated with specific blueprint", async () => {
        // Step 1: Create blueprint
        const blueprint = await BlueprintModel.create({
            name: "Test Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        // Step 2: Create template for blueprint
        const doc = await templateModel.create({
            blueprint_id: blueprint._id,
            filename: "template.docx",
            name: "Blueprint Template",
            format: "docx",
            language: "EN",
            supported_output_formats: ["pdf"]
        });

        // Step 3: Make GET request
        const res = await request(app).get(`/api/templates/${doc._id}`);

        // Step 4: Verify blueprint association
        expect(res.status).toBe(200);
        expect(res.body.blueprint_id).toBe(blueprint._id.toString());
    });

    it("should return 200 and verify createdAt and updatedAt timestamps", async () => {
        // Step 1: Create template
        const doc = await templateModel.create({
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: "template.docx",
            name: "Timestamp Test",
            format: "docx",
            language: "EN",
            supported_output_formats: ["pdf"]
        });

        // Step 2: Make GET request
        const res = await request(app).get(`/api/templates/${doc._id}`);

        // Step 3: Verify timestamps exist and are valid
        expect(res.status).toBe(200);
        expect(res.body.createdAt).toBeDefined();
        expect(res.body.updatedAt).toBeDefined();
        expect(new Date(res.body.createdAt).getTime()).toBeGreaterThan(0);
        expect(new Date(res.body.updatedAt).getTime()).toBeGreaterThan(0);
    });


    // =========================================================================
    // ERROR CASES (404)
    // =========================================================================

    it("should return 404 when template does not exist", async () => {
        // Step 1: Use valid but non-existent ObjectId
        const nonExistentId = "507f1f77bcf86cd799439011";

        // Step 2: Make GET request
        const res = await request(app).get(`/api/templates/${nonExistentId}`);

        // Step 3: Verify status code
        expect(res.status).toBe(404);

        // Step 4: Verify error message
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toBe("Template not found");
    });

    it("should return 404 after template is deleted", async () => {
        // Step 1: Create and then delete template
        const doc = await templateModel.create({
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: "template.docx",
            name: "To Delete",
            format: "docx",
            language: "EN",
            supported_output_formats: ["pdf"]
        });

        await templateModel.findByIdAndDelete(doc._id);

        // Step 2: Try to get deleted template
        const res = await request(app).get(`/api/templates/${doc._id}`);

        // Step 3: Verify 404 error
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Template not found");
    });

    // =========================================================================
    // ERROR CASES (500)
    // =========================================================================

    it("should return 500 for invalid ObjectId format", async () => {
        // Step 1: Use invalid ObjectId
        const invalidId = "invalid-id-format";

        // Step 2: Make GET request
        const res = await request(app).get(`/api/templates/${invalidId}`);

        // Step 3: Verify validation error
        expect(res.status).toBe(500);
    });


    it("should return 500 when database operation fails", async () => {
        // Step 1: Create a valid template
        const doc = await templateModel.create({
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: "template.docx",
            name: "Test Template",
            format: "docx",
            language: "EN",
            supported_output_formats: ["pdf"]
        });

        // Step 2: Spy on database findById method and mock error
        const findSpy = jest.spyOn(templateModel, 'findById').mockImplementationOnce(() => {
            throw new Error("Database query failed");
        });

        // Step 3: Make GET request
        const res = await request(app).get(`/api/templates/${doc._id}`);

        // Step 4: Verify error response
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error");
        expect(res.body).toHaveProperty("details");
        expect(res.body.error).toBe("Internal server error");
        expect(res.body.details).toContain("Database query failed");

        // Step 5: Restore spy
        findSpy.mockRestore();
    });

});
