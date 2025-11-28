import request from "supertest";
import fs from "fs";
import path from "path";
import { app, TEMPLATE_DIR } from "../../setup";

describe("POST /api/templates", () => {

    it("should create a new template with file", async () => {
        const fileContent = Buffer.from("dummy content");
        const fileName = "TestTemplate.docx";

        const res = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: "6928371bbe7c75459cc4a01d",
                name: "Test Template",
                language: "EN"
            }))
            .attach("file", fileContent, fileName);

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
            blueprint_id: "6928371bbe7c75459cc4a01d",
            name: "Test Template",
            default: false,
            format: "docx",
            supported_output_formats: ["pdf", "docx"],
            language: "EN",
        });

        // filename = Test Template-<timestamp>.docx
        expect(res.body.filename).toMatch(/^Test Template-\d+\.docx$/);

        const uploadedFilePath = path.join(TEMPLATE_DIR, res.body.filename);
        expect(fs.existsSync(uploadedFilePath)).toBe(true);
    });

    it("should return 400 if required fields are missing", async () => {
        const res = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                name: "Incomplete Template" // missing blueprint_id, language
            }));

        expect(res.status).toBe(400);
    });

    it("should return 400 if file is missing", async () => {
        const res = await request(app)
            .post("/api/templates")
            .field("data", JSON.stringify({
                blueprint_id: "6928371bbe7c75459cc4a01d",
                name: "No File Template",
                language: "EN"
            }));

        expect(res.status).toBe(400);
    });

});
