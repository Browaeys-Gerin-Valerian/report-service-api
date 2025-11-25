import { Router } from "express";
import { templateController } from "../controllers/template.controller";
import { uploadTemplate } from "../middlewares/uploadTemplate.middleware";

const router = Router();

router.get("/templates", templateController.getAll);
router.get("/templates/:id", templateController.getOneById);
router.post("/templates", uploadTemplate.single("file"), templateController.createOne);
router.patch("/templates/:id", uploadTemplate.single("file"), templateController.updateOne);
router.delete("/templates/:id", templateController.deleteOne);

export default router;
