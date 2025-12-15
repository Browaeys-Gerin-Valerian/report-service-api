import { Router } from "express";
import { templateController } from "@controllers/template.controller";
import { upload } from "@middlewares/multer/upload.middleware";
import { validateRequest } from "@middlewares/zod/validateRequest.middleware";
import { createTemplateSchema, deleteTemplateSchema, getOneTemplateSchema, updateTemplateSchema } from "@middlewares/zod/schemas/template.schema";


const router = Router();

router.get("/templates", templateController.getAll);
router.get("/templates/:id", validateRequest(getOneTemplateSchema), templateController.getOneById);
router.get("/templates/:id/analyze", validateRequest(getOneTemplateSchema), templateController.analyze);
router.post("/templates", upload.single("file"), validateRequest(createTemplateSchema), templateController.createOne);
router.patch("/templates/:id", upload.single("file"), validateRequest(updateTemplateSchema), templateController.updateOne);
router.delete("/templates/:id", validateRequest(deleteTemplateSchema), templateController.deleteOne);

export default router;
