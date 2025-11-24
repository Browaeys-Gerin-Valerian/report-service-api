import { Router } from "express";
import multer from "multer";
import { blueprintController } from "../controllers/blueprint.controller";
const router = Router();


router.get("/blueprints", blueprintController.getAll);
router.get("/blueprints/:id", blueprintController.getOneById);
router.post("/blueprints", multer().none(), blueprintController.createOne);
router.patch("/blueprints/:id", multer().none(), blueprintController.updateOne);
router.delete("/blueprints/:id", blueprintController.deleteOne);

export default router;