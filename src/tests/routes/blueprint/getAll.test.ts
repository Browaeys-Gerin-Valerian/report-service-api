import request from "supertest";
import { app } from "../../setup";
import { IBlueprint } from "../../../types/entity";
import BlueprintModel from "../../../models/blueprint.model";
import { MOCKED_DATA_STRUCTURE } from "../../mock/data/dataStrucutre";

describe("GET /api/blueprints", () => {

    it("should return an empty array when no blueprints exist", async () => {
        const res = await request(app).get("/api/blueprints");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it("should return all templates from the DB", async () => {
        await BlueprintModel.create([
            { name: "Blueprint 1", description: "This is the first blueprint", data_structure: MOCKED_DATA_STRUCTURE.text },
            { name: "Blueprint 2", description: "This is the second blueprint", data_structure: MOCKED_DATA_STRUCTURE.collection },
        ]);
        const res = await request(app).get("/api/blueprints");
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
        expect(res.body.map((B: IBlueprint) => B.name)).toEqual(expect.arrayContaining(["Blueprint 1", "Blueprint 2"]));
    });

    it("should return blueprint with all expected fields", async () => {
        const doc = await BlueprintModel.create({
            name: "Full blueprint",
            description: "This is the full blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.complex,
        });

        const res = await request(app).get("/api/blueprints");
        expect(res.status).toBe(200);
        expect(res.body[0]).toMatchObject({
            _id: doc._id.toString(),
            name: "Full blueprint",
            description: "This is the full blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.complex,
        });
    });

});
