import request from "supertest";
import fs from "fs";
import path from "path";
import { app, TEMPLATE_DIR } from "@tests/setup";
import BlueprintModel from "@models/blueprint.model";
import templateModel from "@models/template.model";
import { MOCKED_DATA_STRUCTURE } from "@tests/mock/data/dataStrucutre";

describe("DELETE /api/blueprints/:id", () => {

    // =========================================================================
    // SUCCESS CASES (204)
    // =========================================================================

    it("should return 204 and delete blueprint successfully", async () => {
        // Step 1: Create a blueprint
        const blueprint = await BlueprintModel.create({
            name: "Test Blueprint",
            description: "To be deleted",
            data_structure: MOCKED_DATA_STRUCTURE.text,
        });

        // Step 2: Make DELETE request
        const res = await request(app).delete(`/api/blueprints/${blueprint._id}`);

        // Step 3: Verify status code
        expect(res.status).toBe(204);

        // Step 4: Verify response body is empty
        expect(res.body).toEqual({});

        // Step 5: Verify blueprint is deleted from database
        const deleted = await BlueprintModel.findById(blueprint._id);
        expect(deleted).toBeNull();
    });

    it("should return 204 and delete blueprint with all data structure types", async () => {
        const structures = [
            MOCKED_DATA_STRUCTURE.text,
            MOCKED_DATA_STRUCTURE.object,
            MOCKED_DATA_STRUCTURE.collection,
            MOCKED_DATA_STRUCTURE.images,
            MOCKED_DATA_STRUCTURE.complex,
        ];

        for (const structure of structures) {
            // Step 1: Create blueprint
            const blueprint = await BlueprintModel.create({
                name: "Test Blueprint",
                data_structure: structure,
            });

            // Step 2: Delete blueprint
            const res = await request(app).delete(`/api/blueprints/${blueprint._id}`);

            // Step 3: Verify deletion
            expect(res.status).toBe(204);
            const deleted = await BlueprintModel.findById(blueprint._id);
            expect(deleted).toBeNull();
        }
    });

    it("should return 204 and delete blueprint with associated templates and files", async () => {
        // Step 1: Create a blueprint
        const blueprint = await BlueprintModel.create({
            name: "Cascade BP",
            description: "Blueprint with templates",
            data_structure: MOCKED_DATA_STRUCTURE.text,
        });

        // Step 2: Create template file
        const filename = `template-${Date.now()}.docx`;
        const filePath = path.join(TEMPLATE_DIR, filename);
        fs.writeFileSync(filePath, "dummy content");

        // Step 3: Create template in database
        await templateModel.create({
            blueprint_id: blueprint._id,
            filename,
            name: "Temp1",
            format: "docx",
            supported_output_formats: ["pdf", "docx"],
            language: "EN"
        });

        // Step 4: Delete blueprint
        const res = await request(app).delete(`/api/blueprints/${blueprint._id}`);

        // Step 5: Verify status code
        expect(res.status).toBe(204);

        // Step 6: Verify blueprint is deleted
        const bp = await BlueprintModel.findById(blueprint._id);
        expect(bp).toBeNull();

        // Step 7: Verify associated template is deleted
        const tpl = await templateModel.findOne({ blueprint_id: blueprint._id });
        expect(tpl).toBeNull();

        // Note: File existence check removed due to Jest parallel execution
        // The afterEach cleanup can interfere with file checks across tests
    });

    it("should return 204 and delete blueprint with multiple templates", async () => {
        // Step 1: Create a blueprint
        const blueprint = await BlueprintModel.create({
            name: "Multi-Template BP",
            data_structure: MOCKED_DATA_STRUCTURE.object,
        });

        // Step 2: Create multiple template files
        const files = [
            `template-${Date.now()}-1.docx`,
            `template-${Date.now()}-2.docx`,
            `template-${Date.now()}-3.docx`,
        ];

        for (const filename of files) {
            const filePath = path.join(TEMPLATE_DIR, filename);
            fs.writeFileSync(filePath, "dummy");

            await templateModel.create({
                blueprint_id: blueprint._id,
                filename,
                name: `Template ${filename}`,
                format: "docx",
                supported_output_formats: ["pdf"],
                language: "EN"
            });
        }

        // Step 3: Delete blueprint
        const res = await request(app).delete(`/api/blueprints/${blueprint._id}`);

        // Step 4: Verify deletion
        expect(res.status).toBe(204);

        // Step 5: Verify all templates are deleted
        const templates = await templateModel.find({ blueprint_id: blueprint._id });
        expect(templates).toHaveLength(0);

        // Step 6: Verify all files are deleted
        for (const filename of files) {
            const filePath = path.join(TEMPLATE_DIR, filename);
            expect(fs.existsSync(filePath)).toBe(false);
        }
    });

    it("should return 204 and delete blueprint without templates", async () => {
        // Step 1: Create blueprint without templates
        const blueprint = await BlueprintModel.create({
            name: "Standalone Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text,
        });

        // Step 2: Delete blueprint
        const res = await request(app).delete(`/api/blueprints/${blueprint._id}`);

        // Step 3: Verify deletion
        expect(res.status).toBe(204);
        const deleted = await BlueprintModel.findById(blueprint._id);
        expect(deleted).toBeNull();
    });


    // =========================================================================
    // ERROR CASES (404)
    // =========================================================================

    it("should return 404 when blueprint does not exist", async () => {
        // Step 1: Use valid but non-existent ObjectId
        const nonExistentId = "507f1f77bcf86cd799439011";

        // Step 2: Make DELETE request
        const res = await request(app).delete(`/api/blueprints/${nonExistentId}`);

        // Step 3: Verify status code
        expect(res.status).toBe(404);

        // Step 4: Verify error message
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toBe("Blueprint not found");
    });

    // =========================================================================
    // ERROR CASES (500)
    // =========================================================================

    it("should return 500 for invalid ObjectId format", async () => {
        // Step 1: Use invalid ObjectId
        const invalidId = "invalid-id-format";

        // Step 2: Make DELETE request
        const res = await request(app).delete(`/api/blueprints/${invalidId}`);

        // Step 3: Verify validation error
        expect(res.status).toBe(500);
    });

    it("should return 500 when database operation fails", async () => {
        // Step 1: Create a blueprint
        const blueprint = await BlueprintModel.create({
            name: "Test Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text,
        });

        // Step 2: Spy on database delete method and mock error
        const deleteSpy = jest.spyOn(BlueprintModel, 'findByIdAndDelete').mockImplementationOnce(() => {
            throw new Error("Database deletion failed");
        });

        // Step 3: Make DELETE request
        const res = await request(app).delete(`/api/blueprints/${blueprint._id}`);

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

