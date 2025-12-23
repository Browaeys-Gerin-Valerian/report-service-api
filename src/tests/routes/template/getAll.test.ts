import request from "supertest";
import templateModel from "@models/template.model";
import BlueprintModel from "@models/blueprint.model";
import { app } from "@tests/setup";
import { ITemplate } from "@custom_types/entity";
import { MOCKED_DATA_STRUCTURE } from "@tests/mock/data/dataStrucutre";

describe("GET /api/templates", () => {

    // =========================================================================
    // SUCCESS CASES (200)
    // =========================================================================

    it("should return 200 and empty array when no templates exist", async () => {
        // Step 1: Make GET request
        const res = await request(app).get("/api/templates");

        // Step 2: Verify status code
        expect(res.status).toBe(200);

        // Step 3: Verify empty array
        expect(res.body).toEqual([]);
        expect(res.body).toHaveLength(0);
    });

    it("should return 200 and all templates from database", async () => {
        // Step 1: Create templates
        await templateModel.create([
            {
                blueprint_id: "6928371bbe7c75459cc4a01d",
                filename: "Template A-1764257308.docx",
                name: "Template A",
                format: "docx",
                language: "EN",
                supported_output_formats: ["pdf", "docx"]
            },
            {
                blueprint_id: "6928371fbe7c75459cc4a01f",
                filename: "Template B-1764257309.docx",
                name: "Template B",
                format: "docx",
                language: "FR",
                supported_output_formats: ["pdf"]
            },
        ]);

        // Step 2: Make GET request
        const res = await request(app).get("/api/templates");

        // Step 3: Verify status code
        expect(res.status).toBe(200);

        // Step 4: Verify response contains both templates
        expect(res.body).toHaveLength(2);
        expect(res.body.map((t: ITemplate) => t.name)).toEqual(
            expect.arrayContaining(["Template A", "Template B"])
        );
    });

    it("should return 200 and templates with all expected fields", async () => {
        // Step 1: Create template with all fields
        const doc = await templateModel.create({
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: "Full Template-1764257308.docx",
            name: "Full Template",
            format: "docx",
            language: "EN",
            supported_output_formats: ["pdf", "docx"]
        });

        // Step 2: Make GET request
        const res = await request(app).get("/api/templates");

        // Step 3: Verify status code
        expect(res.status).toBe(200);

        // Step 4: Verify all fields present
        expect(res.body[0]).toMatchObject({
            _id: doc._id.toString(),
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: "Full Template-1764257308.docx",
            name: "Full Template",
            format: "docx",
            language: "EN",
            supported_output_formats: ["pdf", "docx"]
        });
        expect(res.body[0]).toHaveProperty("createdAt");
        expect(res.body[0]).toHaveProperty("updatedAt");
    });

    it("should return 200 and templates with different formats", async () => {
        // Step 1: Create templates with different formats
        await templateModel.create([
            {
                blueprint_id: "6928371bbe7c75459cc4a01d",
                filename: "template-docx.docx",
                name: "DOCX Template",
                format: "docx",
                language: "EN",
                supported_output_formats: ["pdf", "docx"]
            },
        ]);

        // Step 2: Make GET request
        const res = await request(app).get("/api/templates");

        // Step 3: Verify status code
        expect(res.status).toBe(200);

        // Step 4: Verify different formats returned
        expect(res.body).toHaveLength(1);
        expect(res.body[0].format).toBe("docx");
    });

    it("should return 200 and templates with different languages", async () => {
        // Step 1: Create templates with different languages
        await templateModel.create([
            {
                blueprint_id: "6928371bbe7c75459cc4a01d",
                filename: "template-en.docx",
                name: "English Template",
                format: "docx",
                language: "EN",
                supported_output_formats: ["pdf"]
            },
            {
                blueprint_id: "6928371fbe7c75459cc4a01f",
                filename: "template-fr.docx",
                name: "French Template",
                format: "docx",
                language: "FR",
                supported_output_formats: ["pdf"]
            },
            {
                blueprint_id: "692837bbe7c75459cc4a0201",
                filename: "template-es.docx",
                name: "Spanish Template",
                format: "docx",
                language: "ES",
                supported_output_formats: ["pdf"]
            },
        ]);

        // Step 2: Make GET request
        const res = await request(app).get("/api/templates");

        // Step 3: Verify status code
        expect(res.status).toBe(200);

        // Step 4: Verify all languages returned
        expect(res.body).toHaveLength(3);
        const languages = res.body.map((t: ITemplate) => t.language);
        expect(languages).toContain("EN");
        expect(languages).toContain("FR");
        expect(languages).toContain("ES");
    });

    it("should return 200 and templates with different supported output formats", async () => {
        // Step 1: Create templates with different output formats
        await templateModel.create([
            {
                blueprint_id: "6928371bbe7c75459cc4a01d",
                filename: "template-1.docx",
                name: "PDF Only",
                format: "docx",
                language: "EN",
                supported_output_formats: ["pdf"]
            },
            {
                blueprint_id: "6928371fbe7c75459cc4a01f",
                filename: "template-2.docx",
                name: "Both Formats",
                format: "docx",
                language: "EN",
                supported_output_formats: ["pdf", "docx"]
            },
        ]);

        // Step 2: Make GET request
        const res = await request(app).get("/api/templates");

        // Step 3: Verify status code
        expect(res.status).toBe(200);

        // Step 4: Verify output formats
        expect(res.body).toHaveLength(2);
        const pdfOnly = res.body.find((t: ITemplate) => t.name === "PDF Only");
        const bothFormats = res.body.find((t: ITemplate) => t.name === "Both Formats");
        expect(pdfOnly.supported_output_formats).toEqual(["pdf"]);
        expect(bothFormats.supported_output_formats).toEqual(["pdf", "docx"]);
    });

    it("should return 200 and large number of templates", async () => {
        // Step 1: Create 50 templates
        const templates = Array.from({ length: 50 }, (_, i) => ({
            blueprint_id: "6928371bbe7c75459cc4a01d",
            filename: `template-${i}.docx`,
            name: `Template ${i}`,
            format: "docx",
            language: "EN",
            supported_output_formats: ["pdf"]
        }));
        await templateModel.create(templates);

        // Step 2: Make GET request
        const res = await request(app).get("/api/templates");

        // Step 3: Verify status code
        expect(res.status).toBe(200);

        // Step 4: Verify all templates returned
        expect(res.body).toHaveLength(50);
    });

    it("should return 200 and templates associated with same blueprint", async () => {
        // Step 1: Create blueprint
        const blueprint = await BlueprintModel.create({
            name: "Shared Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        // Step 2: Create multiple templates for same blueprint
        await templateModel.create([
            {
                blueprint_id: blueprint._id,
                filename: "template-1.docx",
                name: "Template 1",
                format: "docx",
                language: "EN",
                supported_output_formats: ["pdf"]
            },
            {
                blueprint_id: blueprint._id,
                filename: "template-2.docx",
                name: "Template 2",
                format: "docx",
                language: "FR",
                supported_output_formats: ["pdf", "docx"]
            },
        ]);

        // Step 3: Make GET request
        const res = await request(app).get("/api/templates");

        // Step 4: Verify both templates returned with same blueprint_id
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body.every((t: ITemplate) => t.blueprint_id.toString() === blueprint._id.toString())).toBe(true);
    });

    // =========================================================================
    // ERROR CASES (500)
    // =========================================================================

    it("should return 500 when database operation fails", async () => {
        // Step 1: Spy on database find method and mock error
        const findSpy = jest.spyOn(templateModel, 'find').mockImplementationOnce(() => {
            throw new Error("Database query failed");
        });

        // Step 2: Make GET request
        const res = await request(app).get("/api/templates");

        // Step 3: Verify error response
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error");
        expect(res.body).toHaveProperty("details");
        expect(res.body.error).toBe("Internal server error");
        expect(res.body.details).toContain("Database query failed");

        // Step 4: Restore spy
        findSpy.mockRestore();
    });

});

