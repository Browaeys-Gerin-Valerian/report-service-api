import request from "supertest";
import { app } from "@tests/setup";
import BlueprintModel from "@models/blueprint.model";
import { MOCKED_DATA_STRUCTURE } from "@tests/mock/data/dataStrucutre";

describe("POST /api/blueprints", () => {

    // =========================================================================
    // SUCCESS CASES (201)
    // =========================================================================

    it("should return 201 and create blueprint with all required fields", async () => {
        // Step 1: Prepare payload with all fields
        const payload = {
            name: "New Blueprint",
            description: "A test blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text,
        };

        // Step 2: Make POST request
        const res = await request(app)
            .post("/api/blueprints")
            .send(payload);

        // Step 3: Verify status code
        expect(res.status).toBe(201);

        // Step 4: Verify response body
        expect(res.body).toMatchObject({
            name: "New Blueprint",
            description: "A test blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text,
        });
        expect(res.body).toHaveProperty("_id");
        expect(res.body).toHaveProperty("createdAt");
        expect(res.body).toHaveProperty("updatedAt");

        // Step 5: Verify database persistence
        const doc = await BlueprintModel.findById(res.body._id);
        expect(doc).toBeDefined();
        expect(doc?.name).toBe("New Blueprint");
        expect(doc?.description).toBe("A test blueprint");
    });

    it("should return 201 and create blueprint without optional description", async () => {
        // Step 1: Prepare payload without description
        const payload = {
            name: "Minimal Blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.object,
        };

        // Step 2: Make POST request
        const res = await request(app)
            .post("/api/blueprints")
            .send(payload);

        // Step 3: Verify status code
        expect(res.status).toBe(201);

        // Step 4: Verify response body
        expect(res.body.name).toBe("Minimal Blueprint");
        expect(res.body.data_structure).toEqual(MOCKED_DATA_STRUCTURE.object);
        expect(res.body.description).toBe("");

        // Step 5: Verify database persistence
        const doc = await BlueprintModel.findById(res.body._id);
        expect(doc?.name).toBe("Minimal Blueprint");
    });

    it("should return 201 and create blueprint with text data structure", async () => {
        // Step 1: Create blueprint with text structure
        const res = await request(app)
            .post("/api/blueprints")
            .send({
                name: "Text Structure",
                data_structure: MOCKED_DATA_STRUCTURE.text,
            });

        // Step 2: Verify creation and structure
        expect(res.status).toBe(201);
        expect(res.body.data_structure).toEqual(MOCKED_DATA_STRUCTURE.text);
    });

    it("should return 201 and create blueprint with object data structure", async () => {
        // Step 1: Create blueprint with object structure
        const res = await request(app)
            .post("/api/blueprints")
            .send({
                name: "Object Structure",
                data_structure: MOCKED_DATA_STRUCTURE.object,
            });

        // Step 2: Verify creation and structure
        expect(res.status).toBe(201);
        expect(res.body.data_structure).toEqual(MOCKED_DATA_STRUCTURE.object);
    });

    it("should return 201 and create blueprint with collection data structure", async () => {
        // Step 1: Create blueprint with collection structure
        const res = await request(app)
            .post("/api/blueprints")
            .send({
                name: "Collection Structure",
                data_structure: MOCKED_DATA_STRUCTURE.collection,
            });

        // Step 2: Verify creation and structure
        expect(res.status).toBe(201);
        expect(res.body.data_structure).toEqual(MOCKED_DATA_STRUCTURE.collection);
    });

    it("should return 201 and create blueprint with images data structure", async () => {
        // Step 1: Create blueprint with images structure
        const res = await request(app)
            .post("/api/blueprints")
            .send({
                name: "Images Structure",
                data_structure: MOCKED_DATA_STRUCTURE.images,
            });

        // Step 2: Verify creation and structure
        expect(res.status).toBe(201);
        expect(res.body.data_structure).toEqual(MOCKED_DATA_STRUCTURE.images);
    });

    it("should return 201 and create blueprint with complex data structure", async () => {
        // Step 1: Create blueprint with complex structure
        const res = await request(app)
            .post("/api/blueprints")
            .send({
                name: "Complex Structure",
                description: "Complex nested structure",
                data_structure: MOCKED_DATA_STRUCTURE.complex,
            });

        // Step 2: Verify creation and structure
        expect(res.status).toBe(201);
        expect(res.body.data_structure).toEqual(MOCKED_DATA_STRUCTURE.complex);
        expect(res.body.data_structure).toHaveProperty("report_title");
        expect(res.body.data_structure).toHaveProperty("author");
        expect(res.body.data_structure).toHaveProperty("sections");
    });

    it("should return 201 and create multiple blueprints independently", async () => {
        // Step 1: Create first blueprint
        const res1 = await request(app)
            .post("/api/blueprints")
            .send({
                name: "Blueprint 1",
                data_structure: MOCKED_DATA_STRUCTURE.text,
            });

        // Step 2: Create second blueprint
        const res2 = await request(app)
            .post("/api/blueprints")
            .send({
                name: "Blueprint 2",
                data_structure: MOCKED_DATA_STRUCTURE.object,
            });

        // Step 3: Verify both created successfully
        expect(res1.status).toBe(201);
        expect(res2.status).toBe(201);

        // Step 4: Verify different IDs
        expect(res1.body._id).not.toBe(res2.body._id);

        // Step 5: Verify both exist in database
        const doc1 = await BlueprintModel.findById(res1.body._id);
        const doc2 = await BlueprintModel.findById(res2.body._id);
        expect(doc1).toBeDefined();
        expect(doc2).toBeDefined();
    });

    // =========================================================================
    // ERROR CASES (400)
    // =========================================================================

    it("should return 400 when name is missing", async () => {
        // Step 1: Send request without name
        const res = await request(app)
            .post("/api/blueprints")
            .send({
                description: "Missing name",
                data_structure: MOCKED_DATA_STRUCTURE.text,
            });

        // Step 2: Verify validation error
        expect(res.status).toBe(400);
    });

    it("should return 400 when data_structure is missing", async () => {
        // Step 1: Send request without data_structure
        const res = await request(app)
            .post("/api/blueprints")
            .send({
                name: "Missing data_structure",
                description: "No structure provided",
            });

        // Step 2: Verify validation error
        expect(res.status).toBe(400);
    });

    it("should return 400 when both name and data_structure are missing", async () => {
        // Step 1: Send request with only description
        const res = await request(app)
            .post("/api/blueprints")
            .send({
                description: "Missing name and data_structure"
            });

        // Step 2: Verify validation error
        expect(res.status).toBe(400);
    });

    it("should return 400 when data_structure has invalid type", async () => {
        // Step 1: Send request with invalid data structure type
        const res = await request(app)
            .post("/api/blueprints")
            .send({
                name: "Invalid Structure",
                data_structure: {
                    field1: {
                        type: "invalid_type", // Invalid type
                        required: true,
                    }
                }
            });

        // Step 2: Verify validation error
        expect(res.status).toBe(400);
    });

    it("should return 400 when name is empty string", async () => {
        // Step 1: Send request with empty name
        const res = await request(app)
            .post("/api/blueprints")
            .send({
                name: "",
                data_structure: MOCKED_DATA_STRUCTURE.text,
            });

        // Step 2: Verify validation error
        expect(res.status).toBe(400);
    });

    it("should return 400 when data_structure is not an object", async () => {
        // Step 1: Send request with invalid data_structure format
        const res = await request(app)
            .post("/api/blueprints")
            .send({
                name: "Invalid Format",
                data_structure: "not an object",
            });

        // Step 2: Verify validation error
        expect(res.status).toBe(400);
    });

    // =========================================================================
    // ERROR CASES (500)
    // =========================================================================

    it("should return 500 when database operation fails", async () => {
        // Step 1: Spy on database save method and mock error
        const saveSpy = jest.spyOn(BlueprintModel.prototype, 'save').mockRejectedValueOnce(
            new Error("Database connection failed")
        );

        // Step 2: Make POST request
        const res = await request(app)
            .post("/api/blueprints")
            .send({
                name: "Test Blueprint",
                data_structure: MOCKED_DATA_STRUCTURE.text,
            });

        // Step 3: Verify error response
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error");
        expect(res.body).toHaveProperty("details");
        expect(res.body.error).toBe("Internal server error");
        expect(res.body.details).toContain("Database connection failed");

        // Step 4: Restore spy
        saveSpy.mockRestore();
    });

});
