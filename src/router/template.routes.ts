import { Router } from "express";
import { templateController } from "../controllers/template.controller";
import { uploadTemplate } from "../middlewares/multer/uploadTemplate.middleware";
import { validateRequest } from "../middlewares/zod/validateRequest.middleware";
import { createTemplateSchema, deleteTemplateSchema, getAllTemplatesSchema, getOneTemplateSchema, updateTemplateSchema } from "../middlewares/zod/schemas/template.schema";


const router = Router();

router.get("/templates", validateRequest(getAllTemplatesSchema), templateController.getAll);
router.get("/templates/:id", validateRequest(getOneTemplateSchema), templateController.getOneById);
router.post("/templates", uploadTemplate.single("file"), validateRequest(createTemplateSchema), templateController.createOne);
router.patch("/templates/:id", uploadTemplate.single("file"), validateRequest(updateTemplateSchema), templateController.updateOne);
router.delete("/templates/:id", validateRequest(deleteTemplateSchema), templateController.deleteOne);

export default router;
