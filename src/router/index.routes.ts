import { Router } from "express";
import modelRouter from './model.routes';
import templateRouter from './template.routes';
import generateRouter from './generate.routes';
const router = Router();

router.use(modelRouter);
router.use(templateRouter);
router.use(generateRouter);

export { router };