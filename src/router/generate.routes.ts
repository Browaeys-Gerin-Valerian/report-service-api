import { Router } from "express";
import { generatorController } from "@controllers/generator.controller";
import { validateRequest } from "@middlewares/zod/validateRequest.middleware";
import { generateSchema } from "@middlewares/zod/schemas/generate.schema";
import { upload } from "@middlewares/multer/upload.middleware";
const router = Router();


router.post("/generate", upload.array('files'), validateRequest(generateSchema), generatorController.generate);


export default router;