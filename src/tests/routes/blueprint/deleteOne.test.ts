import request from "supertest";
import fs from "fs";
import path from "path";
import { app, TEMPLATE_DIR } from "@tests/setup";
import BlueprintModel from "@models/blueprint.model";
import templateModel from "@models/template.model";
import { MOCKED_DATA_STRUCTURE } from "@tests/mock/data/dataStrucutre";

describe("DELETE /api/blueprints/:id", () => {

    it("should delete blueprint, templates and template files", async () => {
        const blueprint = await BlueprintModel.create({
            name: "Cascade BP",
            description: "",
            data_structure: MOCKED_DATA_STRUCTURE.text,
        });

        const filename = `template-${Date.now()}.docx`;
        const filePath = path.join(TEMPLATE_DIR, filename);
        fs.writeFileSync(filePath, "dummy");

        await templateModel.create({
            blueprint_id: blueprint._id,
            filename,
            name: "Temp1",
            format: "docx",
            supported_output_formats: ["pdf", "docx"],
            language: "EN"
        });

        const res = await request(app).delete(`/api/blueprints/${blueprint._id}`);
        expect(res.status).toBe(204);

        const bp = await BlueprintModel.findById(blueprint._id);
        expect(bp).toBeNull();

        const tpl = await templateModel.findOne({ blueprint_id: blueprint._id });
        expect(tpl).toBeNull();

        expect(fs.existsSync(filePath)).toBe(false);
    });

    it("should return 404 if blueprint not found", async () => {
        const res = await request(app)
            .delete("/api/blueprints/6928371bbe7c75459cc4a01d");
        expect(res.status).toBe(404);
    });

});
