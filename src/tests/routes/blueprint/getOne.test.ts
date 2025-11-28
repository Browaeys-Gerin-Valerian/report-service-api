import request from "supertest";
import { app } from "../../setup";
import blueprintModel from "../../../models/blueprint.model";

describe("GET /api/blueprints/:id", () => {

    it("should return the blueprint by ID", async () => {
        const doc = await blueprintModel.create({
            name: "Blueprint A",
            description: "Test description",
            data_structure: { a: 123 }
        });

        const res = await request(app).get(`/api/blueprints/${doc._id}`);

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            _id: doc._id.toString(),
            name: "Blueprint A",
            description: "Test description",
            data_structure: { a: 123 },
        });
    });

    it("should return 404 if blueprint not found", async () => {
        const res = await request(app).get("/api/blueprints/6928371bbe7c75459cc4a01d");
        expect(res.status).toBe(404);
    });
});
