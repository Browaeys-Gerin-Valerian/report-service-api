import request from "supertest";
import { app } from "../../setup";
import blueprintModel from "../../../models/blueprint.model";

describe("POST /api/blueprints", () => {

    it("should create a blueprint successfully", async () => {
        const payload = {
            name: "New Blueprint",
            description: "A test blueprint",
            data_structure: JSON.stringify({ x: "y" }) // parsé par parsedBody()
        };

        const res = await request(app)
            .post("/api/blueprints")
            .type("form") // x-www-form-urlencoded
            .send(payload);

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
            name: "New Blueprint",
            description: "A test blueprint",
            data_structure: { x: "y" },
        });

        const doc = await blueprintModel.findById(res.body._id);
        expect(doc).not.toBeNull();
        expect(doc?.name).toBe("New Blueprint");
    });

    it("should return 400 if required fields are missing", async () => {
        const res = await request(app)
            .post("/api/blueprints")
            .type("form")
            .send({
                description: "Missing name and data_structure"
            });

        expect(res.status).toBe(400);
    });

});
