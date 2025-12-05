import request from "supertest";
import { app } from "../../setup";
import { IBlueprint } from "../../../types";
import blueprintModel from "../../../models/blueprint.model";

describe("GET /api/blueprints", () => {

    it("should return an empty array first", async () => {
        const res = await request(app).get("/api/blueprints");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it("should return all templates from the DB", async () => {
        await blueprintModel.create([
            { name: "Blueprint 1", description: "This is the first blueprint", data_structure: { somekey: "somevalue" } },
            { name: "Blueprint 2", description: "This is the second blueprint", data_structure: { somekey: ["toto", "titi", "tata"] } },
        ]);
        const res = await request(app).get("/api/blueprints");
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
        expect(res.body.map((B: IBlueprint) => B.name)).toEqual(expect.arrayContaining(["Blueprint 1", "Blueprint 2"]));
    });

    it("should return blueprint with all expected fields", async () => {
        const doc = await blueprintModel.create({
            name: "Full blueprint",
            description: "This is the full blueprint",
            data_structure: {
                key: {
                    nest_key: 'nested_value'
                },
                key2: "value2",
                key3: ['value3']
            },
        });

        const res = await request(app).get("/api/blueprints");
        expect(res.status).toBe(200);
        expect(res.body[0]).toMatchObject({
            _id: doc._id.toString(),
            name: "Full blueprint",
            description: "This is the full blueprint",
            data_structure: {
                key: {
                    nest_key: 'nested_value'
                },
                key2: "value2",
                key3: ['value3']
            },
        });
    });

});
