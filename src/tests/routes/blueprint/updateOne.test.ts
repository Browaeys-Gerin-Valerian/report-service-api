import request from "supertest";
import { app } from "@tests/setup";
import BlueprintModel from "@models/blueprint.model";
import { MOCKED_DATA_STRUCTURE } from "@tests/mock/data/dataStrucutre";

describe("PATCH /api/blueprints/:id", () => {

    // =========================================================================
    // SUCCESS CASES (200)
    // =========================================================================

    it("should return 200 and update name only", async () => {
        // Step 1: Create initial blueprint
        const doc = await BlueprintModel.create({
            name: "Old Name",
            description: "Original description",
            data_structure: MOCKED_DATA_STRUCTURE.text,
        });
        const originalUpdatedAt = doc.updatedAt as Date;

        // Step 2: Wait a bit to ensure timestamp difference
        await new Promise(resolve => setTimeout(resolve, 10));

        // Step 3: Make PATCH request to update name
        const res = await request(app)
            .patch(`/api/blueprints/${doc._id}`)
            .send({ name: "Updated Name" });

        // Step 4: Verify status code
        expect(res.status).toBe(200);

        // Step 5: Verify response data
        expect(res.body._id).toBe(doc._id.toString());
        expect(res.body.name).toBe("Updated Name");
        expect(res.body.description).toBe("Original description");
        expect(res.body.data_structure).toEqual(MOCKED_DATA_STRUCTURE.text);

        // Step 6: Verify database persistence
        const updated = await BlueprintModel.findById(doc._id);
        expect(updated?.name).toBe("Updated Name");
        expect(updated?.description).toBe("Original description");

        // Step 7: Verify updatedAt changed
        expect(new Date(res.body.updatedAt).getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it("should return 200 and update description only", async () => {
        // Step 1: Create initial blueprint
        const doc = await BlueprintModel.create({
            name: "Test Blueprint",
            description: "Old description",
            data_structure: MOCKED_DATA_STRUCTURE.object,
        });

        // Step 2: Make PATCH request to update description
        const res = await request(app)
            .patch(`/api/blueprints/${doc._id}`)
            .send({ description: "New description" });

        // Step 3: Verify status code
        expect(res.status).toBe(200);

        // Step 4: Verify response data
        expect(res.body.name).toBe("Test Blueprint");
        expect(res.body.description).toBe("New description");
        expect(res.body.data_structure).toEqual(MOCKED_DATA_STRUCTURE.object);
    });

    it("should return 200 and update data_structure only", async () => {
        // Step 1: Create initial blueprint with text structure
        const doc = await BlueprintModel.create({
            name: "Test Blueprint",
            description: "Description",
            data_structure: MOCKED_DATA_STRUCTURE.text,
        });

        // Step 2: Make PATCH request to update data_structure
        const res = await request(app)
            .patch(`/api/blueprints/${doc._id}`)
            .send({ data_structure: MOCKED_DATA_STRUCTURE.complex });

        // Step 3: Verify status code
        expect(res.status).toBe(200);

        // Step 4: Verify response data
        expect(res.body.name).toBe("Test Blueprint");
        expect(res.body.description).toBe("Description");
        expect(res.body.data_structure).toEqual(MOCKED_DATA_STRUCTURE.complex);

        // Step 5: Verify database persistence
        const updated = await BlueprintModel.findById(doc._id);
        expect(updated).toBeDefined();
        expect(updated?.name).toBe("Test Blueprint");
    });

    it("should return 200 and update multiple fields at once", async () => {
        // Step 1: Create initial blueprint
        const doc = await BlueprintModel.create({
            name: "Old Name",
            description: "Old description",
            data_structure: MOCKED_DATA_STRUCTURE.text,
        });

        // Step 2: Make PATCH request to update all fields
        const res = await request(app)
            .patch(`/api/blueprints/${doc._id}`)
            .send({
                name: "Updated Name",
                description: "New description",
                data_structure: MOCKED_DATA_STRUCTURE.complex
            });

        // Step 3: Verify status code
        expect(res.status).toBe(200);

        // Step 4: Verify all fields updated
        expect(res.body).toMatchObject({
            _id: doc._id.toString(),
            name: "Updated Name",
            description: "New description",
            data_structure: MOCKED_DATA_STRUCTURE.complex,
        });

        // Step 5: Verify database persistence
        const updated = await BlueprintModel.findById(doc._id);
        expect(updated?.name).toBe("Updated Name");
        expect(updated?.description).toBe("New description");
        expect(updated).toBeDefined();
    });

    it("should return 200 and update with different data structure types", async () => {
        // Step 1: Create initial blueprint
        const doc = await BlueprintModel.create({
            name: "Test Blueprint",
            description: "Test",
            data_structure: MOCKED_DATA_STRUCTURE.text,
        });

        const structures = [
            MOCKED_DATA_STRUCTURE.object,
            MOCKED_DATA_STRUCTURE.collection,
            MOCKED_DATA_STRUCTURE.images,
            MOCKED_DATA_STRUCTURE.complex,
        ];

        // Step 2: Test updating with each structure type
        for (const structure of structures) {
            const res = await request(app)
                .patch(`/api/blueprints/${doc._id}`)
                .send({ data_structure: structure });

            // Step 3: Verify status and data
            expect(res.status).toBe(200);
            expect(res.body.data_structure).toEqual(structure);
        }
    });

    it("should return 200 and handle empty update (no changes)", async () => {
        // Step 1: Create initial blueprint
        const doc = await BlueprintModel.create({
            name: "Test Blueprint",
            description: "Description",
            data_structure: MOCKED_DATA_STRUCTURE.text,
        });

        // Step 2: Make PATCH request with no fields to update
        const res = await request(app)
            .patch(`/api/blueprints/${doc._id}`)
            .send({});

        // Step 3: Verify status code
        expect(res.status).toBe(200);

        // Step 4: Verify data unchanged
        expect(res.body.name).toBe("Test Blueprint");
        expect(res.body.description).toBe("Description");
    });

    // =========================================================================
    // ERROR CASES (400)
    // =========================================================================

    it("should return 400 for invalid data structure format", async () => {
        // Step 1: Create initial blueprint
        const doc = await BlueprintModel.create({
            name: "Test Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text,
        });

        // Step 2: Make PATCH request with invalid data structure
        const res = await request(app)
            .patch(`/api/blueprints/${doc._id}`)
            .send({
                data_structure: {
                    invalid_field: {
                        type: "invalid_type", // Invalid type
                        required: true
                    }
                }
            });

        // Step 3: Verify validation error
        expect(res.status).toBe(400);
    });

    // =========================================================================
    // ERROR CASES (404)
    // =========================================================================

    it("should return 404 when blueprint does not exist", async () => {
        // Step 1: Use valid but non-existent MongoDB ObjectId
        const nonExistentId = "507f1f77bcf86cd799439011";

        // Step 2: Make PATCH request
        const res = await request(app)
            .patch(`/api/blueprints/${nonExistentId}`)
            .send({ name: "Updated Name" });

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
        // Step 1: Use invalid MongoDB ObjectId
        const invalidId = "invalid-id-123";

        // Step 2: Make PATCH request
        const res = await request(app)
            .patch(`/api/blueprints/${invalidId}`)
            .send({ name: "Updated Name" });

        // Step 3: Verify validation error
        expect(res.status).toBe(500);
    });

    it("should return 500 when database operation fails", async () => {
        // Step 1: Create a valid blueprint first
        const doc = await BlueprintModel.create({
            name: "Test Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text
        });

        // Step 2: Spy on database findByIdAndUpdate method and mock error
        const updateSpy = jest.spyOn(BlueprintModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
            throw new Error("Database update failed");
        });

        // Step 3: Make PATCH request
        const res = await request(app)
            .patch(`/api/blueprints/${doc._id}`)
            .send({ name: "Updated Name" });

        // Step 4: Verify error response
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error");
        expect(res.body).toHaveProperty("details");
        expect(res.body.error).toBe("Internal server error");
        expect(res.body.details).toContain("Database update failed");

        // Step 5: Restore spy
        updateSpy.mockRestore();
    });

});
