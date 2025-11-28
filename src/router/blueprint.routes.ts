import { Router } from "express";
import { blueprintController } from "../controllers/blueprint.controller";
import { validateRequest } from "../middlewares/zod/validateRequest.middleware";
import { getOneBlueprintSchema, createBlueprintSchema, deleteBlueprintSchema, updateBlueprintSchema } from "../middlewares/zod/schemas/blueprint.schema";
const router = Router();


router.get("/blueprints", blueprintController.getAll);
router.get("/blueprints/:id", validateRequest(getOneBlueprintSchema), blueprintController.getOneById);
router.post("/blueprints", validateRequest(createBlueprintSchema), blueprintController.createOne);
router.patch("/blueprints/:id", validateRequest(updateBlueprintSchema), blueprintController.updateOne);
router.delete("/blueprints/:id", validateRequest(deleteBlueprintSchema), blueprintController.deleteOne);

export default router;