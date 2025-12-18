import request from "supertest";
import { app } from "@tests/setup";
import { IBlueprint } from "@custom_types/entity";
import BlueprintModel from "@models/blueprint.model";
import { MOCKED_DATA_STRUCTURE } from "@tests/mock/data/dataStrucutre";

describe("GET /api/blueprints", () => {

    // =========================================================================
    // SUCCESS CASES (200)
    // =========================================================================

    it("should return 200 and an empty array when no blueprints exist", async () => {
        // Step 1: Make GET request
        const res = await request(app).get("/api/blueprints");

        // Step 2: Verify status code
        expect(res.status).toBe(200);

        // Step 3: Verify empty array response
        expect(res.body).toEqual([]);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("should return 200 and all blueprints from the database", async () => {
        // Step 1: Create test blueprints
        await BlueprintModel.create([
            { name: "Blueprint 1", description: "This is the first blueprint", data_structure: MOCKED_DATA_STRUCTURE.text },
            { name: "Blueprint 2", description: "This is the second blueprint", data_structure: MOCKED_DATA_STRUCTURE.collection },
        ]);

        // Step 2: Make GET request
        const res = await request(app).get("/api/blueprints");

        // Step 3: Verify status code
        expect(res.status).toBe(200);

        // Step 4: Verify array length
        expect(res.body.length).toBe(2);

        // Step 5: Verify blueprint names are present
        expect(res.body.map((b: IBlueprint) => b.name)).toEqual(
            expect.arrayContaining(["Blueprint 1", "Blueprint 2"])
        );
    });

    it("should return 200 and blueprint with all expected fields", async () => {
        // Step 1: Create blueprint with full data
        const doc = await BlueprintModel.create({
            name: "Full blueprint",
            description: "This is the full blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.complex,
        });

        // Step 2: Make GET request
        const res = await request(app).get("/api/blueprints");

        // Step 3: Verify status code
        expect(res.status).toBe(200);

        // Step 4: Verify blueprint structure
        expect(res.body[0]).toMatchObject({
            _id: doc._id.toString(),
            name: "Full blueprint",
            description: "This is the full blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.complex,
        });

        // Step 5: Verify timestamps exist
        expect(res.body[0]).toHaveProperty("createdAt");
        expect(res.body[0]).toHaveProperty("updatedAt");
        expect(new Date(res.body[0].createdAt)).toBeInstanceOf(Date);
        expect(new Date(res.body[0].updatedAt)).toBeInstanceOf(Date);
    });

    it("should return 200 and blueprints with different data structure types", async () => {
        // Step 1: Create blueprints with various data structure types
        await BlueprintModel.create([
            { name: "Text Blueprint", data_structure: MOCKED_DATA_STRUCTURE.text },
            { name: "Object Blueprint", data_structure: MOCKED_DATA_STRUCTURE.object },
            { name: "Collection Blueprint", data_structure: MOCKED_DATA_STRUCTURE.collection },
            { name: "Images Blueprint", data_structure: MOCKED_DATA_STRUCTURE.images },
            { name: "Complex Blueprint", data_structure: MOCKED_DATA_STRUCTURE.complex },
        ]);

        // Step 2: Make GET request
        const res = await request(app).get("/api/blueprints");

        // Step 3: Verify status code
        expect(res.status).toBe(200);

        // Step 4: Verify all blueprints are returned
        expect(res.body.length).toBe(5);

        // Step 5: Verify each blueprint has valid data structure
        res.body.forEach((blueprint: IBlueprint) => {
            expect(blueprint.data_structure).toBeDefined();
            expect(typeof blueprint.data_structure).toBe("object");
        });
    });

    // =========================================================================
    // ERROR CASES (500)
    // =========================================================================

    it("should return 500 when database operation fails", async () => {
        // Step 1: Spy on database find method and mock error
        const findSpy = jest.spyOn(BlueprintModel, 'find').mockImplementationOnce(() => {
            throw new Error("Database connection failed");
        });

        // Step 2: Make GET request
        const res = await request(app).get("/api/blueprints");

        // Step 3: Verify error response
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error");
        expect(res.body).toHaveProperty("details");
        expect(res.body.error).toBe("Internal server error");
        expect(res.body.details).toContain("Database connection failed");

        // Step 4: Restore spy
        findSpy.mockRestore();
    });

});
