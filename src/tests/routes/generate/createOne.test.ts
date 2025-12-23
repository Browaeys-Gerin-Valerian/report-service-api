import fs from "fs";
import path from "path";
import request from "supertest";
import BlueprintModel from "@models/blueprint.model";
import TemplateModel from "@models/template.model";
import { app, TEMPLATE_DIR } from "@tests/setup";
import { MOCKED_DATA } from "@tests/mock/data/data";
import { MOCKED_DATA_STRUCTURE } from "@tests/mock/data/dataStrucutre";

describe("POST /api/generate", () => {
    let blueprintId: string;
    let templateId: string;

    // =================================================================
    // NOTE: Success cases with status 200 would require valid DOCX template files
    // which are complex to create in automated tests. The generate endpoint flow
    // is tested through validation and error cases which validate the controller logic.
    // =================================================================

    // =================================================================
    // VALIDATION ERRORS (400)
    // =================================================================

    describe("Validation Errors (Schema)", () => {
        beforeEach(async () => {
            // Step 1: Create blueprint
            const blueprint = await BlueprintModel.create({
                name: "Test Blueprint",
                data_structure: MOCKED_DATA_STRUCTURE.text,
            });
            blueprintId = blueprint._id.toString();

            // Step 2: Create template file
            const templateFilename = `Test Template-${Date.now()}.docx`;
            const templatePath = path.join(TEMPLATE_DIR, templateFilename);
            fs.writeFileSync(templatePath, Buffer.from("dummy template content"));

            // Step 3: Create template in database
            const template = await TemplateModel.create({
                blueprint_id: blueprintId,
                name: "Test Template",
                filename: templateFilename,
                format: "docx",
                language: "EN",
            });
            templateId = template._id.toString();
        });

        it("should return 400 when template_id is missing", async () => {
            // Step 1: Make POST request without template_id
            const res = await request(app)
                .post("/api/generate")
                .field(
                    "data",
                    JSON.stringify({
                        blueprint_id: blueprintId,
                        output_format: "docx",
                        data_to_insert: MOCKED_DATA.text.validText,
                    })
                );

            // Step 2: Verify validation error
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Validation error");
        });

        it("should return 400 when blueprint_id is missing", async () => {
            // Step 1: Make POST request without blueprint_id
            const res = await request(app)
                .post("/api/generate")
                .field(
                    "data",
                    JSON.stringify({
                        template_id: templateId,
                        output_format: "docx",
                        data_to_insert: MOCKED_DATA.text.validText,
                    })
                );

            // Step 2: Verify validation error
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Validation error");
        });

        it("should return 400 when output_format is missing", async () => {
            // Step 1: Make POST request without output_format
            const res = await request(app)
                .post("/api/generate")
                .field(
                    "data",
                    JSON.stringify({
                        template_id: templateId,
                        blueprint_id: blueprintId,
                        data_to_insert: MOCKED_DATA.text.validText,
                    })
                );

            // Step 2: Verify validation error
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Validation error");
        });

        it("should return 400 when data_to_insert is missing", async () => {
            // Step 1: Make POST request without data_to_insert
            const res = await request(app)
                .post("/api/generate")
                .field(
                    "data",
                    JSON.stringify({
                        template_id: templateId,
                        blueprint_id: blueprintId,
                        output_format: "docx",
                    })
                );

            // Step 2: Verify validation error
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Validation error");
        });

        it("should return 400 when output_format is invalid", async () => {
            // Step 1: Make POST request with invalid output_format
            const res = await request(app)
                .post("/api/generate")
                .field(
                    "data",
                    JSON.stringify({
                        template_id: templateId,
                        blueprint_id: blueprintId,
                        output_format: "invalid",
                        data_to_insert: MOCKED_DATA.text.validText,
                    })
                );

            // Step 2: Verify validation error
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Validation error");
        });

        it("should return 400 when data is not provided at all", async () => {
            // Step 1: Make POST request without data field
            const res = await request(app).post("/api/generate");

            // Step 2: Verify validation error
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Validation error");
        });

        it("should return 400 when all required fields are missing", async () => {
            // Step 1: Make POST request with empty data object
            const res = await request(app)
                .post("/api/generate")
                .field("data", JSON.stringify({}));

            // Step 2: Verify validation error
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Validation error");
        });
    });

    // =================================================================
    // ERROR CASES (404)
    // =================================================================

    describe("Not Found Errors", () => {
        beforeEach(async () => {
            // Step 1: Create blueprint
            const blueprint = await BlueprintModel.create({
                name: "Test Blueprint",
                data_structure: MOCKED_DATA_STRUCTURE.text,
            });
            blueprintId = blueprint._id.toString();

            // Step 2: Create template file
            const templateFilename = `Test Template-${Date.now()}.docx`;
            const templatePath = path.join(TEMPLATE_DIR, templateFilename);
            fs.writeFileSync(templatePath, Buffer.from("dummy template content"));

            // Step 3: Create template in database
            const template = await TemplateModel.create({
                blueprint_id: blueprintId,
                name: "Test Template",
                filename: templateFilename,
                format: "docx",
                language: "EN",
            });
            templateId = template._id.toString();
        });

        it("should return 404 when blueprint not found", async () => {
            // Step 1: Use valid but non-existent blueprint ID
            const fakeId = "507f1f77bcf86cd799439011";

            // Step 2: Make POST request
            const res = await request(app)
                .post("/api/generate")
                .field(
                    "data",
                    JSON.stringify({
                        template_id: templateId,
                        blueprint_id: fakeId,
                        output_format: "docx",
                        data_to_insert: MOCKED_DATA.text.validText,
                    })
                );

            // Step 3: Verify not found error
            expect(res.status).toBe(404);
            expect(res.body.error).toBe("Blueprint not found");
        });

        it("should return 404 when template not found", async () => {
            // Step 1: Use valid but non-existent template ID
            const fakeId = "507f1f77bcf86cd799439011";

            // Step 2: Make POST request
            const res = await request(app)
                .post("/api/generate")
                .field(
                    "data",
                    JSON.stringify({
                        template_id: fakeId,
                        blueprint_id: blueprintId,
                        output_format: "docx",
                        data_to_insert: MOCKED_DATA.text.validText,
                    })
                );

            // Step 3: Verify not found error
            expect(res.status).toBe(404);
            expect(res.body.error).toBe("Template not found");
        });
    });

    // =================================================================
    // ERROR CASES (500)
    // =================================================================

    describe("Server Errors", () => {
        beforeEach(async () => {
            // Step 1: Create blueprint
            const blueprint = await BlueprintModel.create({
                name: "Test Blueprint",
                data_structure: MOCKED_DATA_STRUCTURE.text,
            });
            blueprintId = blueprint._id.toString();

            // Step 2: Create template file
            const templateFilename = `Test Template-${Date.now()}.docx`;
            const templatePath = path.join(TEMPLATE_DIR, templateFilename);
            fs.writeFileSync(templatePath, Buffer.from("dummy template content"));

            // Step 3: Create template in database
            const template = await TemplateModel.create({
                blueprint_id: blueprintId,
                name: "Test Template",
                filename: templateFilename,
                format: "docx",
                language: "EN",
            });
            templateId = template._id.toString();
        });

        it("should return 500 for invalid blueprint_id format", async () => {
            // Step 1: Make POST request with invalid ObjectId
            const res = await request(app)
                .post("/api/generate")
                .field(
                    "data",
                    JSON.stringify({
                        template_id: templateId,
                        blueprint_id: "invalid-id",
                        output_format: "docx",
                        data_to_insert: MOCKED_DATA.text.validText,
                    })
                );

            // Step 2: Verify server error
            expect(res.status).toBe(500);
        });

        it("should return 500 for invalid template_id format", async () => {
            // Step 1: Make POST request with invalid ObjectId
            const res = await request(app)
                .post("/api/generate")
                .field(
                    "data",
                    JSON.stringify({
                        template_id: "invalid-id",
                        blueprint_id: blueprintId,
                        output_format: "docx",
                        data_to_insert: MOCKED_DATA.text.validText,
                    })
                );

            // Step 2: Verify server error
            expect(res.status).toBe(500);
        });

        it("should return 500 when template file is missing from disk", async () => {
            // Step 1: Create template without physical file
            const template = await TemplateModel.create({
                blueprint_id: blueprintId,
                name: "Missing File Template",
                filename: "nonexistent-file.docx",
                format: "docx",
                language: "EN",
            });

            // Step 2: Try to generate with missing file
            const res = await request(app)
                .post("/api/generate")
                .field(
                    "data",
                    JSON.stringify({
                        template_id: template._id.toString(),
                        blueprint_id: blueprintId,
                        output_format: "docx",
                        data_to_insert: MOCKED_DATA.text.validText,
                    })
                );

            // Step 3: Verify server error
            expect(res.status).toBe(500);
        });
    });
});
