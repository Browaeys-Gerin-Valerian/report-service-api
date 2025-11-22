import { Router } from "express";
import { blueprintController } from "../controllers/blueprint.controller";
const router = Router();

router.get("/blueprints", blueprintController.getAll);
router.post("/blueprints", blueprintController.createOne);
router.patch("/blueprints/:id", blueprintController.updateOne);
router.delete("/blueprints/:id", blueprintController.deleteOne);

export default router;