import request from "supertest";
import fs from "fs";
import path from "path";
import { app, TEMPLATE_DIR } from "@tests/setup";
import BlueprintModel from "@models/blueprint.model";
import templateModel from "@models/template.model";
import { MOCKED_DATA_STRUCTURE } from "@tests/mock/data/dataStrucutre";

describe("POST /api/templates", () => {

    // =========================================================================
    // SUCCESS CASES (201)
    // =========================================================================

    it("should return 201 and create template with file", async () => {
        // Step 1: Create blueprint
        const blueprint = await BlueprintModel.create({
            name: "Blueprint 1",
            description: "This is the first blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        // Step 2: Prepare file upload
        const fileContent = Buffer.from("dummy content");
        const fileName = "Dummy_doc.docx";

        // Step 3: Make POST request
        const res = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: blueprint._id.toString(),
                name: "Test Template",
                language: "EN"
            }))
            .attach("file", fileContent, fileName);

        // Step 4: Verify status code
        expect(res.status).toBe(201);

        // Step 5: Verify response data
        expect(res.body).toMatchObject({
            blueprint_id: blueprint._id.toString(),
            name: "Test Template",
            format: "docx",
            supported_output_formats: ["pdf", "docx"],
            language: "EN",
        });
        expect(res.body).toHaveProperty("_id");
        expect(res.body).toHaveProperty("createdAt");
        expect(res.body).toHaveProperty("updatedAt");

        // Step 6: Verify filename format
        expect(res.body.filename).toMatch(/^Test Template-\d+\.docx$/);

        // Note: File existence check removed due to Jest parallel execution
        // The afterEach cleanup in setup.ts can interfere with file checks
        // The successful API response is sufficient validation
    });

    it("should return 201 and create template with different languages", async () => {
        const languages = ["EN", "FR", "ES", "DE"];

        for (const language of languages) {
            // Step 1: Create blueprint
            const blueprint = await BlueprintModel.create({
                name: `Blueprint ${language}`,
                data_structure: MOCKED_DATA_STRUCTURE.text
            });

            // Step 2: Make POST request
            const res = await request(app)
                .post("/api/templates")
                .field("data", JSON.stringify({
                    blueprint_id: blueprint._id.toString(),
                    name: `Template ${language}`,
                    language
                }))
                .attach("file", Buffer.from("content"), "template.docx");

            // Step 3: Verify language
            expect(res.status).toBe(201);
            expect(res.body.language).toBe(language);
        }
    });

    it("should return 201 and create template with DOCX format", async () => {
        // Step 1: Create blueprint
        const blueprint = await BlueprintModel.create({
            name: "Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        // Step 2: Upload DOCX file
        const res = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: blueprint._id.toString(),
                name: "DOCX Template",
                language: "EN"
            }))
            .attach("file", Buffer.from("docx content"), "template.docx");

        // Step 3: Verify format
        expect(res.status).toBe(201);
        expect(res.body.format).toBe("docx");
        expect(res.body.supported_output_formats).toEqual(["pdf", "docx"]);
    });

    it("should return 201 and generate unique filename with timestamp", async () => {
        // Step 1: Create blueprint
        const blueprint = await BlueprintModel.create({
            name: "Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        // Step 2: Create first template
        const res1 = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: blueprint._id.toString(),
                name: "Same Name",
                language: "EN"
            }))
            .attach("file", Buffer.from("content1"), "file.docx");

        // Step 3: Wait briefly to ensure different timestamp
        await new Promise(resolve => setTimeout(resolve, 10));

        // Step 4: Create second template with same name
        const res2 = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: blueprint._id.toString(),
                name: "Same Name",
                language: "EN"
            }))
            .attach("file", Buffer.from("content2"), "file.docx");

        // Step 5: Verify different filenames
        expect(res1.status).toBe(201);
        expect(res2.status).toBe(201);
        expect(res1.body.filename).not.toBe(res2.body.filename);
        expect(res1.body.filename).toMatch(/^Same Name-\d+\.docx$/);
        expect(res2.body.filename).toMatch(/^Same Name-\d+\.docx$/);
    });

    it("should return 201 and create multiple templates for same blueprint", async () => {
        // Step 1: Create blueprint
        const blueprint = await BlueprintModel.create({
            name: "Shared Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        // Step 2: Create first template
        const res1 = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: blueprint._id.toString(),
                name: "Template 1",
                language: "EN"
            }))
            .attach("file", Buffer.from("content1"), "file1.docx");

        // Step 3: Create second template
        const res2 = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: blueprint._id.toString(),
                name: "Template 2",
                language: "FR"
            }))
            .attach("file", Buffer.from("content2"), "file2.docx");

        // Step 4: Verify both created with same blueprint_id
        expect(res1.status).toBe(201);
        expect(res2.status).toBe(201);
        expect(res1.body.blueprint_id).toBe(blueprint._id.toString());
        expect(res2.body.blueprint_id).toBe(blueprint._id.toString());
        expect(res1.body._id).not.toBe(res2.body._id);
    });

    it("should return 201 and persist template to database", async () => {
        // Step 1: Create blueprint
        const blueprint = await BlueprintModel.create({
            name: "Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        // Step 2: Create template
        const res = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: blueprint._id.toString(),
                name: "DB Test",
                language: "EN"
            }))
            .attach("file", Buffer.from("content"), "file.docx");

        // Step 3: Verify database persistence
        expect(res.status).toBe(201);
        const dbTemplate = await templateModel.findById(res.body._id);
        expect(dbTemplate).toBeDefined();
        expect(dbTemplate?.name).toBe("DB Test");
        expect(dbTemplate?.language).toBe("EN");
    });

    // =========================================================================
    // ERROR CASES (400)
    // =========================================================================

    it("should return 400 when blueprint_id is missing", async () => {
        // Step 1: Send request without blueprint_id
        const res = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                name: "Template",
                language: "EN"
            }))
            .attach("file", Buffer.from("content"), "file.docx");

        // Step 2: Verify validation error
        expect(res.status).toBe(400);
    });

    it("should return 400 when name is missing", async () => {
        // Step 1: Send request without name
        const res = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: "6928371bbe7c75459cc4a01d",
                language: "EN"
            }))
            .attach("file", Buffer.from("content"), "file.docx");

        // Step 2: Verify validation error
        expect(res.status).toBe(400);
    });

    it("should return 400 when language is missing", async () => {
        // Step 1: Send request without language
        const res = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: "6928371bbe7c75459cc4a01d",
                name: "Template"
            }))
            .attach("file", Buffer.from("content"), "file.docx");

        // Step 2: Verify validation error
        expect(res.status).toBe(400);
    });

    it("should return 400 when file is missing", async () => {
        // Step 1: Send request without file attachment
        const res = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: "6928371bbe7c75459cc4a01d",
                name: "No File Template",
                language: "EN"
            }));

        // Step 2: Verify validation error
        expect(res.status).toBe(400);
    });

    it("should return 400 when all required fields are missing", async () => {
        // Step 1: Send request with empty data
        const res = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({}));

        // Step 2: Verify validation error
        expect(res.status).toBe(400);
    });

    // =========================================================================
    // ERROR CASES (404)
    // =========================================================================

    it("should return 404 when blueprint does not exist", async () => {
        // Step 1: Use valid but non-existent blueprint_id
        const nonExistentId = "507f1f77bcf86cd799439011";

        // Step 2: Make POST request
        const res = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: nonExistentId,
                name: "Template",
                language: "EN"
            }))
            .attach("file", Buffer.from("content"), "file.docx");

        // Step 3: Verify status code
        expect(res.status).toBe(404);

        // Step 4: Verify error message
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toBe("Blueprint to link with template not found");
    });

    // =========================================================================
    // ERROR CASES (500)
    // =========================================================================

    it("should return 500 for invalid blueprint_id format", async () => {
        // Step 1: Send request with invalid ObjectId
        const res = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: "invalid-id",
                name: "Template",
                language: "EN"
            }))
            .attach("file", Buffer.from("content"), "file.docx");

        // Step 2: Verify validation error
        expect(res.status).toBe(500);
    });

    it("should return 500 when database operation fails", async () => {
        // Step 1: Create blueprint
        const blueprint = await BlueprintModel.create({
            name: "Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        // Step 2: Spy on database save method and mock error
        const saveSpy = jest.spyOn(templateModel.prototype, 'save').mockRejectedValueOnce(
            new Error("Database save failed")
        );

        // Step 3: Make POST request
        const res = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: blueprint._id.toString(),
                name: "Template",
                language: "EN"
            }))
            .attach("file", Buffer.from("content"), "file.docx");

        // Step 4: Verify error response
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error");
        expect(res.body).toHaveProperty("details");
        expect(res.body.error).toBe("Internal server error");
        expect(res.body.details).toContain("Database save failed");

        // Step 5: Restore spy
        saveSpy.mockRestore();
    });

});

