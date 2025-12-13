import fs from "fs";
import path from "path";
import request from "supertest";
import BlueprintModel from "../../../models/blueprint.model";
import TemplateModel from "../../../models/template.model";
import { app, TEMPLATE_DIR } from "../../setup";
import { MOCKED_DATA } from "../../mock/data/data";
import { MOCKED_DATA_STRUCTURE } from "../../mock/data/dataStrucutre";

describe("POST /api/generate", () => {
    let blueprintId: string;
    let templateId: string;

    // =================================================================
    // SUCCESS CASES
    // =================================================================

    // describe("Success Cases", () => {
    //     // =================================================================
    //     // TEXT CASES
    //     // =================================================================
    //     describe("Text Data", () => {
    //         beforeEach(async () => {
    //             const blueprint = await BlueprintModel.create({
    //                 name: "Text Blueprint",
    //                 description: "Blueprint for text fields",
    //                 data_structure: MOCKED_DATA_STRUCTURE.text,
    //             });
    //             blueprintId = blueprint._id.toString();

    //             const template = await TemplateModel.create({
    //                 blueprint_id: blueprintId,
    //                 name: "Text Template",
    //                 filename: "Text Template-1765638376.docx",
    //                 format: "docx",
    //                 language: "EN",
    //             });
    //             templateId = template._id.toString();
    //         });

    //         it("should generate document with valid text data (DOCX)", async () => {
    //             const res = await request(app)
    //                 .post("/api/generate")
    //                 .field(
    //                     "data",
    //                     JSON.stringify({
    //                         template_id: templateId,
    //                         blueprint_id: blueprintId,
    //                         output_format: "docx",
    //                         data_to_insert: MOCKED_DATA.text.validText,
    //                     })
    //                 );

    //             expect(res.status).toBe(200);
    //             expect(res.headers["content-type"]).toContain("application/vnd.openxmlformats");
    //             expect(res.headers["content-disposition"]).toContain("generated.docx");
    //             expect(Buffer.isBuffer(res.body)).toBe(true);
    //         });

    //         it("should generate document with valid text data including optional field", async () => {
    //             const res = await request(app)
    //                 .post("/api/generate")
    //                 .field(
    //                     "data",
    //                     JSON.stringify({
    //                         template_id: templateId,
    //                         blueprint_id: blueprintId,
    //                         output_format: "docx",
    //                         data_to_insert: MOCKED_DATA.text.validTextWithOptional,
    //                     })
    //                 );

    //             expect(res.status).toBe(200);
    //         });
    //     });

    //     // =================================================================
    //     // OBJECT CASES
    //     // =================================================================
    //     describe("Object Data", () => {
    //         beforeEach(async () => {
    //             const blueprint = await BlueprintModel.create({
    //                 name: "Object Blueprint",
    //                 description: "Blueprint for object fields",
    //                 data_structure: MOCKED_DATA_STRUCTURE.object,
    //             });
    //             blueprintId = blueprint._id.toString();

    //             const templateFilename = `Object Template-${Date.now()}.docx`;
    //             const templatePath = path.join(TEMPLATE_DIR, templateFilename);
    //             fs.writeFileSync(templatePath, Buffer.from("dummy template content"));

    //             const template = await TemplateModel.create({
    //                 blueprint_id: blueprintId,
    //                 name: "Object Template",
    //                 filename: templateFilename,
    //                 format: "docx",
    //                 language: "EN",
    //             });
    //             templateId = template._id.toString();
    //         });

    //         it("should generate document with valid nested object data", async () => {
    //             const res = await request(app)
    //                 .post("/api/generate")
    //                 .field(
    //                     "data",
    //                     JSON.stringify({
    //                         template_id: templateId,
    //                         blueprint_id: blueprintId,
    //                         output_format: "docx",
    //                         data_to_insert: MOCKED_DATA.object.validObject,
    //                     })
    //                 );

    //             expect(res.status).toBe(200);
    //         });
    //     });

    //     // =================================================================
    //     // COLLECTION CASES
    //     // =================================================================
    //     describe("Collection Data", () => {
    //         beforeEach(async () => {
    //             const blueprint = await BlueprintModel.create({
    //                 name: "Collection Blueprint",
    //                 description: "Blueprint for collection fields",
    //                 data_structure: MOCKED_DATA_STRUCTURE.collection,
    //             });
    //             blueprintId = blueprint._id.toString();

    //             const templateFilename = `Collection Template-${Date.now()}.docx`;
    //             const templatePath = path.join(TEMPLATE_DIR, templateFilename);
    //             fs.writeFileSync(templatePath, Buffer.from("dummy template content"));

    //             const template = await TemplateModel.create({
    //                 blueprint_id: blueprintId,
    //                 name: "Collection Template",
    //                 filename: templateFilename,
    //                 format: "docx",
    //                 language: "EN",
    //             });
    //             templateId = template._id.toString();
    //         });

    //         it("should generate document with valid collection data", async () => {
    //             const res = await request(app)
    //                 .post("/api/generate")
    //                 .field(
    //                     "data",
    //                     JSON.stringify({
    //                         template_id: templateId,
    //                         blueprint_id: blueprintId,
    //                         output_format: "docx",
    //                         data_to_insert: MOCKED_DATA.collection.validCollection,
    //                     })
    //                 );

    //             expect(res.status).toBe(200);
    //         });
    //     });

    //     // =================================================================
    //     // IMAGE CASES
    //     // =================================================================
    //     describe("Image Data", () => {
    //         beforeEach(async () => {
    //             const blueprint = await BlueprintModel.create({
    //                 name: "Image Blueprint",
    //                 description: "Blueprint for image fields",
    //                 data_structure: MOCKED_DATA_STRUCTURE.images,
    //             });
    //             blueprintId = blueprint._id.toString();

    //             const templateFilename = `Image Template-${Date.now()}.docx`;
    //             const templatePath = path.join(TEMPLATE_DIR, templateFilename);
    //             fs.writeFileSync(templatePath, Buffer.from("dummy template content"));

    //             const template = await TemplateModel.create({
    //                 blueprint_id: blueprintId,
    //                 name: "Image Template",
    //                 filename: templateFilename,
    //                 format: "docx",
    //                 language: "EN",
    //             });
    //             templateId = template._id.toString();
    //         });

    //         it("should generate document with valid image data and files", async () => {
    //             const res = await request(app)
    //                 .post("/api/generate")
    //                 .field(
    //                     "data",
    //                     JSON.stringify({
    //                         template_id: templateId,
    //                         blueprint_id: blueprintId,
    //                         output_format: "docx",
    //                         data_to_insert: MOCKED_DATA.images.validImages,
    //                     })
    //                 )
    //                 .attach("files", Buffer.from("fake avatar image"), "avatar.jpg")
    //                 .attach("files", Buffer.from("fake gallery image 1"), "gallery-1.jpg")
    //                 .attach("files", Buffer.from("fake gallery image 2"), "gallery-2.jpg");

    //             expect(res.status).toBe(200);
    //         });

    //         it("should generate document with only required images", async () => {
    //             const res = await request(app)
    //                 .post("/api/generate")
    //                 .field(
    //                     "data",
    //                     JSON.stringify({
    //                         template_id: templateId,
    //                         blueprint_id: blueprintId,
    //                         output_format: "docx",
    //                         data_to_insert: {
    //                             avatar: {
    //                                 id: "img-1",
    //                                 filename: "avatar.jpg",
    //                             },
    //                         },
    //                     })
    //                 )
    //                 .attach("files", Buffer.from("fake avatar image"), "avatar.jpg");

    //             expect(res.status).toBe(200);
    //         });
    //     });

    //     // =================================================================
    //     // COMPLEX CASES
    //     // =================================================================
    //     describe("Complex Data", () => {
    //         beforeEach(async () => {
    //             const blueprint = await BlueprintModel.create({
    //                 name: "Complex Blueprint",
    //                 description: "Blueprint for complex nested data",
    //                 data_structure: MOCKED_DATA_STRUCTURE.complex,
    //             });
    //             blueprintId = blueprint._id.toString();

    //             const templateFilename = `Complex Template-${Date.now()}.docx`;
    //             const templatePath = path.join(TEMPLATE_DIR, templateFilename);
    //             fs.writeFileSync(templatePath, Buffer.from("dummy template content"));

    //             const template = await TemplateModel.create({
    //                 blueprint_id: blueprintId,
    //                 name: "Complex Template",
    //                 filename: templateFilename,
    //                 format: "docx",
    //                 language: "EN",
    //             });
    //             templateId = template._id.toString();
    //         });

    //         it("should generate document with complex valid data", async () => {
    //             const res = await request(app)
    //                 .post("/api/generate")
    //                 .field(
    //                     "data",
    //                     JSON.stringify({
    //                         template_id: templateId,
    //                         blueprint_id: blueprintId,
    //                         output_format: "docx",
    //                         data_to_insert: MOCKED_DATA.complex.validComplex,
    //                     })
    //                 )
    //                 .attach("files", Buffer.from("author photo"), "author.jpg")
    //                 .attach("files", Buffer.from("section illustration"), "results.jpg");

    //             expect(res.status).toBe(200);
    //         });

    //         it("should generate document with complex data without optional images", async () => {
    //             const res = await request(app)
    //                 .post("/api/generate")
    //                 .field(
    //                     "data",
    //                     JSON.stringify({
    //                         template_id: templateId,
    //                         blueprint_id: blueprintId,
    //                         output_format: "docx",
    //                         data_to_insert: {
    //                             report_title: "Annual Report",
    //                             author: {
    //                                 fields: {
    //                                     firstname: "Jean",
    //                                     lastname: "Dupont",
    //                                 },
    //                             },
    //                             sections: {
    //                                 items: [
    //                                     {
    //                                         fields: {
    //                                             title: "Introduction",
    //                                             content: "This is the intro",
    //                                         },
    //                                     },
    //                                 ],
    //                             },
    //                         },
    //                     })
    //                 );

    //             expect(res.status).toBe(200);
    //         });
    //     });
    // });

    // =================================================================
    // VALIDATION ERRORS (Schema Level - Zod)
    // =================================================================

    describe("Validation Errors (Schema)", () => {
        beforeEach(async () => {
            const blueprint = await BlueprintModel.create({
                name: "Test Blueprint",
                data_structure: MOCKED_DATA_STRUCTURE.text,
            });
            blueprintId = blueprint._id.toString();

            const templateFilename = `Test Template-${Date.now()}.docx`;
            const templatePath = path.join(TEMPLATE_DIR, templateFilename);
            fs.writeFileSync(templatePath, Buffer.from("dummy template content"));

            const template = await TemplateModel.create({
                blueprint_id: blueprintId,
                name: "Test Template",
                filename: templateFilename,
                format: "docx",
                language: "EN",
            });
            templateId = template._id.toString();
        });

        it("should return 400 when template_id is missing", async () => {
            const res = await request(app)
                .post("/api/generate")
                .field(
                    "data",
                    JSON.stringify({
                        blueprint_id: blueprintId,
                        output_format: "docx",
                        data_to_insert: MOCKED_DATA.text.validText,
                    })
                );

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Validation error");
        });

        it("should return 400 when blueprint_id is missing", async () => {
            const res = await request(app)
                .post("/api/generate")
                .field(
                    "data",
                    JSON.stringify({
                        template_id: templateId,
                        output_format: "docx",
                        data_to_insert: MOCKED_DATA.text.validText,
                    })
                );

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Validation error");
        });

        it("should return 400 when output_format is missing", async () => {
            const res = await request(app)
                .post("/api/generate")
                .field(
                    "data",
                    JSON.stringify({
                        template_id: templateId,
                        blueprint_id: blueprintId,
                        data_to_insert: MOCKED_DATA.text.validText,
                    })
                );

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Validation error");
        });

        it("should return 400 when data_to_insert is missing", async () => {
            const res = await request(app)
                .post("/api/generate")
                .field(
                    "data",
                    JSON.stringify({
                        template_id: templateId,
                        blueprint_id: blueprintId,
                        output_format: "docx",
                    })
                );

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Validation error");
        });

        it("should return 400 when output_format is invalid", async () => {
            const res = await request(app)
                .post("/api/generate")
                .field(
                    "data",
                    JSON.stringify({
                        template_id: templateId,
                        blueprint_id: blueprintId,
                        output_format: "invalid",
                        data_to_insert: MOCKED_DATA.text.validText,
                    })
                );

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Validation error");
        });

        it("should return 400 when data is not provided at all", async () => {
            const res = await request(app).post("/api/generate");

            expect(res.status).toBe(400);
            expect(res.body.error).toBe("Validation error");
        });
    });

    // =================================================================
    // NOT FOUND ERRORS
    // =================================================================

    describe("Not Found Errors", () => {
        beforeEach(async () => {
            const blueprint = await BlueprintModel.create({
                name: "Test Blueprint",
                data_structure: MOCKED_DATA_STRUCTURE.text,
            });
            blueprintId = blueprint._id.toString();

            const templateFilename = `Test Template-${Date.now()}.docx`;
            const templatePath = path.join(TEMPLATE_DIR, templateFilename);
            fs.writeFileSync(templatePath, Buffer.from("dummy template content"));

            const template = await TemplateModel.create({
                blueprint_id: blueprintId,
                name: "Test Template",
                filename: templateFilename,
                format: "docx",
                language: "EN",
            });
            templateId = template._id.toString();
        });

        it("should return 404 when blueprint not found", async () => {
            const fakeId = "507f1f77bcf86cd799439011";
            const res = await request(app)
                .post("/api/generate")
                .field(
                    "data",
                    JSON.stringify({
                        template_id: templateId,
                        blueprint_id: fakeId,
                        output_format: "docx",
                        data_to_insert: MOCKED_DATA.text.validText,
                    })
                );

            expect(res.status).toBe(404);
            expect(res.body.error).toBe("Blueprint not found");
        });

        it("should return 404 when template not found", async () => {
            const fakeId = "507f1f77bcf86cd799439011";
            const res = await request(app)
                .post("/api/generate")
                .field(
                    "data",
                    JSON.stringify({
                        template_id: fakeId,
                        blueprint_id: blueprintId,
                        output_format: "docx",
                        data_to_insert: MOCKED_DATA.text.validText,
                    })
                );

            expect(res.status).toBe(404);
            expect(res.body.error).toBe("Template not found");
        });
    });

    // =================================================================
    // DATA VALIDATION ERRORS
    // =================================================================

    describe("Data Validation Errors", () => {
        describe("Text Data Validation", () => {
            beforeEach(async () => {
                const blueprint = await BlueprintModel.create({
                    name: "Text Blueprint",
                    data_structure: MOCKED_DATA_STRUCTURE.text,
                });
                blueprintId = blueprint._id.toString();

                const templateFilename = `Text Template-${Date.now()}.docx`;
                const templatePath = path.join(TEMPLATE_DIR, templateFilename);
                fs.writeFileSync(templatePath, Buffer.from("dummy template content"));

                const template = await TemplateModel.create({
                    blueprint_id: blueprintId,
                    name: "Text Template",
                    filename: templateFilename,
                    format: "docx",
                    language: "EN",
                });
                templateId = template._id.toString();
            });

            it("should return 500 when required text field is missing", async () => {
                const res = await request(app)
                    .post("/api/generate")
                    .field(
                        "data",
                        JSON.stringify({
                            template_id: templateId,
                            blueprint_id: blueprintId,
                            output_format: "docx",
                            data_to_insert: MOCKED_DATA.text.missingRequiredText,
                        })
                    );

                expect(res.status).toBe(500);
                expect(res.body.error).toBe("Failed to generate template");
            });

            it("should return 500 when text field has wrong type", async () => {
                const res = await request(app)
                    .post("/api/generate")
                    .field(
                        "data",
                        JSON.stringify({
                            template_id: templateId,
                            blueprint_id: blueprintId,
                            output_format: "docx",
                            data_to_insert: {
                                firstname: 123, // Should be string
                                lastname: "Dupont",
                            },
                        })
                    );

                expect(res.status).toBe(500);
                expect(res.body.error).toBe("Failed to generate template");
            });
        });

        describe("Object Data Validation", () => {
            beforeEach(async () => {
                const blueprint = await BlueprintModel.create({
                    name: "Object Blueprint",
                    data_structure: MOCKED_DATA_STRUCTURE.object,
                });
                blueprintId = blueprint._id.toString();

                const templateFilename = `Object Template-${Date.now()}.docx`;
                const templatePath = path.join(TEMPLATE_DIR, templateFilename);
                fs.writeFileSync(templatePath, Buffer.from("dummy template content"));

                const template = await TemplateModel.create({
                    blueprint_id: blueprintId,
                    name: "Object Template",
                    filename: templateFilename,
                    format: "docx",
                    language: "EN",
                });
                templateId = template._id.toString();
            });

            it("should return 500 when object is missing 'fields' property", async () => {
                const res = await request(app)
                    .post("/api/generate")
                    .field(
                        "data",
                        JSON.stringify({
                            template_id: templateId,
                            blueprint_id: blueprintId,
                            output_format: "docx",
                            data_to_insert: MOCKED_DATA.object.invalidObject,
                        })
                    );

                expect(res.status).toBe(500);
                expect(res.body.error).toBe("Failed to generate template");
            });

            it("should return 500 when nested required field is missing", async () => {
                const res = await request(app)
                    .post("/api/generate")
                    .field(
                        "data",
                        JSON.stringify({
                            template_id: templateId,
                            blueprint_id: blueprintId,
                            output_format: "docx",
                            data_to_insert: {
                                user: {
                                    fields: {
                                        firstname: "Jean",
                                        // lastname is required but missing
                                    },
                                },
                            },
                        })
                    );

                expect(res.status).toBe(500);
                expect(res.body.error).toBe("Failed to generate template");
            });
        });

        describe("Collection Data Validation", () => {
            beforeEach(async () => {
                const blueprint = await BlueprintModel.create({
                    name: "Collection Blueprint",
                    data_structure: MOCKED_DATA_STRUCTURE.collection,
                });
                blueprintId = blueprint._id.toString();

                const templateFilename = `Collection Template-${Date.now()}.docx`;
                const templatePath = path.join(TEMPLATE_DIR, templateFilename);
                fs.writeFileSync(templatePath, Buffer.from("dummy template content"));

                const template = await TemplateModel.create({
                    blueprint_id: blueprintId,
                    name: "Collection Template",
                    filename: templateFilename,
                    format: "docx",
                    language: "EN",
                });
                templateId = template._id.toString();
            });

            it("should return 500 when collection item is missing required field", async () => {
                const res = await request(app)
                    .post("/api/generate")
                    .field(
                        "data",
                        JSON.stringify({
                            template_id: templateId,
                            blueprint_id: blueprintId,
                            output_format: "docx",
                            data_to_insert: MOCKED_DATA.collection.invalidCollectionItem,
                        })
                    );

                expect(res.status).toBe(500);
                expect(res.body.error).toBe("Failed to generate template");
            });

            it("should return 500 when collection is missing 'items' property", async () => {
                const res = await request(app)
                    .post("/api/generate")
                    .field(
                        "data",
                        JSON.stringify({
                            template_id: templateId,
                            blueprint_id: blueprintId,
                            output_format: "docx",
                            data_to_insert: {
                                skills: {
                                    // Missing 'items' property
                                    wrongProperty: [],
                                },
                            },
                        })
                    );

                expect(res.status).toBe(500);
                expect(res.body.error).toBe("Failed to generate template");
            });

            it("should return 500 when collection items array is empty", async () => {
                const res = await request(app)
                    .post("/api/generate")
                    .field(
                        "data",
                        JSON.stringify({
                            template_id: templateId,
                            blueprint_id: blueprintId,
                            output_format: "docx",
                            data_to_insert: {
                                skills: {
                                    items: [], // Empty array
                                },
                            },
                        })
                    );

                expect(res.status).toBe(500);
                expect(res.body.error).toBe("Failed to generate template");
            });
        });

        describe("Image Data Validation", () => {
            beforeEach(async () => {
                const blueprint = await BlueprintModel.create({
                    name: "Image Blueprint",
                    data_structure: MOCKED_DATA_STRUCTURE.images,
                });
                blueprintId = blueprint._id.toString();

                const templateFilename = `Image Template-${Date.now()}.docx`;
                const templatePath = path.join(TEMPLATE_DIR, templateFilename);
                fs.writeFileSync(templatePath, Buffer.from("dummy template content"));

                const template = await TemplateModel.create({
                    blueprint_id: blueprintId,
                    name: "Image Template",
                    filename: templateFilename,
                    format: "docx",
                    language: "EN",
                });
                templateId = template._id.toString();
            });

            it("should return 500 when required image is missing", async () => {
                const res = await request(app)
                    .post("/api/generate")
                    .field(
                        "data",
                        JSON.stringify({
                            template_id: templateId,
                            blueprint_id: blueprintId,
                            output_format: "docx",
                            data_to_insert: MOCKED_DATA.images.missingRequiredImage,
                        })
                    );

                expect(res.status).toBe(500);
                expect(res.body.error).toBe("Failed to generate template");
            });

            it("should return 500 when image file is not uploaded", async () => {
                const res = await request(app)
                    .post("/api/generate")
                    .field(
                        "data",
                        JSON.stringify({
                            template_id: templateId,
                            blueprint_id: blueprintId,
                            output_format: "docx",
                            data_to_insert: MOCKED_DATA.images.validImages,
                        })
                    );
                // No files attached

                expect(res.status).toBe(500);
                expect(res.body.error).toBe("Failed to generate template");
            });

            it("should return 500 when image filename doesn't match uploaded file", async () => {
                const res = await request(app)
                    .post("/api/generate")
                    .field(
                        "data",
                        JSON.stringify({
                            template_id: templateId,
                            blueprint_id: blueprintId,
                            output_format: "docx",
                            data_to_insert: {
                                avatar: {
                                    id: "img-1",
                                    filename: "avatar.jpg",
                                },
                            },
                        })
                    )
                    .attach("files", Buffer.from("image"), "wrong-filename.jpg"); // Mismatched filename

                expect(res.status).toBe(500);
                expect(res.body.error).toBe("Failed to generate template");
            });

            it("should return 500 when image data has wrong type", async () => {
                const res = await request(app)
                    .post("/api/generate")
                    .field(
                        "data",
                        JSON.stringify({
                            template_id: templateId,
                            blueprint_id: blueprintId,
                            output_format: "docx",
                            data_to_insert: MOCKED_DATA.images.invalidImage,
                        })
                    );

                expect(res.status).toBe(500);
                expect(res.body.error).toBe("Failed to generate template");
            });
        });
    });
});
