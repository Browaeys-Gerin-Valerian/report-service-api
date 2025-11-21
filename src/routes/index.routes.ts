import { Router } from "express";
const router = Router();
router.get("/", (_req, res) => {
    res.send("API is running");
});

export { router };