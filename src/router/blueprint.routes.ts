import { Router } from "express";
import multer from "multer";
import { blueprintController } from "../controllers/blueprint.controller";
import { validateRequest } from "../middlewares/zod/validateRequest.middleware";
import { getAllBlueprintsSchema, getOneBlueprintSchema, createBlueprintSchema, updateTemplateSchema, deleteTemplateSchema } from "../middlewares/zod/schemas/blueprint.schema";
const router = Router();


router.get("/blueprints", validateRequest(getAllBlueprintsSchema), blueprintController.getAll);
router.get("/blueprints/:id", validateRequest(getOneBlueprintSchema), blueprintController.getOneById);
router.post("/blueprints", multer().none(), validateRequest(createBlueprintSchema), blueprintController.createOne);
router.patch("/blueprints/:id", multer().none(), validateRequest(updateTemplateSchema), blueprintController.updateOne);
router.delete("/blueprints/:id", validateRequest(deleteTemplateSchema), blueprintController.deleteOne);

export default router;