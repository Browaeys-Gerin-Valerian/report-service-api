import request from "supertest";
import { app } from "../../setup";
import BlueprintModel from "../../../models/blueprint.model";
import { MOCKED_DATA_STRUCTURE } from "../../mock/data/dataStrucutre";

describe("POST /api/blueprints", () => {

    it("should create a blueprint successfully", async () => {
        const payload = {
            name: "New Blueprint",
            description: "A test blueprint",
            data_structure: JSON.stringify(MOCKED_DATA_STRUCTURE.text),
        };

        const res = await request(app)
            .post("/api/blueprints")
            .type("form")
            .send(payload);

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
            name: "New Blueprint",
            description: "A test blueprint",
            data_structure: MOCKED_DATA_STRUCTURE.text,
        });

        const doc = await BlueprintModel.findById(res.body._id);
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
