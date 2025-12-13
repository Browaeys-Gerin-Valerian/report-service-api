import { Router } from "express";
import blueprintRouter from '@router/blueprint.routes';
import templateRouter from '@router/template.routes';
import generateRouter from '@router/generate.routes';
const router = Router();

router.use(blueprintRouter);
router.use(templateRouter);
router.use(generateRouter);

export { router };