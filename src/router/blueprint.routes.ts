import { Router } from "express";
const router = Router();


router.get("/blueprint", (_req, res) => {
    res.send("blueprint endpoint");
});

router.post("/blueprint", (_req, res) => {
    res.send("Create a new blueprint");
});

router.patch("/blueprint/:id", (_req, res) => {
    res.send(`Update blueprint with id ${_req.params.id}`);
});

router.delete("/blueprint/:id", (_req, res) => {
    res.send(`Delete blueprint with id ${_req.params.id}`);
});

export default router;