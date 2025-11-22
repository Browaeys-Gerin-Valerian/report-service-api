import { Router } from "express";
import blueprintRouter from './blueprint.routes';
import templateRouter from './template.routes';
import generateRouter from './generate.routes';
const router = Router();

router.use(blueprintRouter);
router.use(templateRouter);
router.use(generateRouter);

export { router };