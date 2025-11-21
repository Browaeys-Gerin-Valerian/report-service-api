import { Router } from "express";
const router = Router();


router.get("/models", (_req, res) => {
    res.send("Models endpoint");
});

router.post("/models", (_req, res) => {
    res.send("Create a new model");
});

router.patch("/models/:id", (_req, res) => {
    res.send(`Update model with id ${_req.params.id}`);
});

router.delete("/models/:id", (_req, res) => {
    res.send(`Delete model with id ${_req.params.id}`);
});

export default router;