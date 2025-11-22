import { Router } from "express";
import { templateController } from "../controllers/template.controller";
const router = Router();

router.get("/templates", templateController.getAll);
router.post("/templates", templateController.createOne);
router.patch("/templates/:id", templateController.updateOne);
router.delete("/templates/:id", templateController.deleteOne);

export default router;