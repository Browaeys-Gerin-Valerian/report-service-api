import { Router } from "express";
const router = Router();


router.post("/generate", (_req, res) => {
    res.send("generate endpoint");
});


export default router;