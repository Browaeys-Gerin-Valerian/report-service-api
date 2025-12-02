import { Router } from "express";
import { generatorController } from "../controllers/generator.controller";
import { validateRequest } from "../middlewares/zod/validateRequest.middleware";
import { generateSchema } from "../middlewares/zod/schemas/generate.schema";
const router = Router();


router.post("/generate", validateRequest(generateSchema), generatorController.generate);


export default router;