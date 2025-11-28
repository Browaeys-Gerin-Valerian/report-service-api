import request from "supertest";
import { app } from "../../setup";
import blueprintModel from "../../../models/blueprint.model";

describe("PATCH /api/blueprints/:id", () => {

    it("should update blueprint fields", async () => {
        const doc = await blueprintModel.create({
            name: "Old Name",
            description: "Old description",
            data_structure: { a: 1 },
        });


        const res = await request(app)
            .patch(`/api/blueprints/${doc._id}`)
            .type("form")
            .send({
                name: "Updated Name",
                description: "New description",
                data_structure: JSON.stringify({ new: true })
            });

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            _id: doc._id.toString(),
            name: "Updated Name",
            description: "New description",
            data_structure: { new: true },
        });

        const updated = await blueprintModel.findById(doc._id);
        expect(updated?.name).toBe("Updated Name");
        expect(updated?.description).toBe("New description");
    });

    it("should return 404 if blueprint not found", async () => {
        const res = await request(app)
            .patch("/api/blueprints/6928371bbe7c75459cc4a01d")
            .type("form")
            .send({ name: "Updated Name" });

        expect(res.status).toBe(404);
    });

});
