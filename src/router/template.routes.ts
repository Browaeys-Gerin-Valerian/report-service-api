import { Router } from "express";
const router = Router();


router.get("/templates", (_req, res) => {
    res.send("template endpoint");
});

router.post("/templates", (_req, res) => {
    res.send("Create a new template");
});

router.patch("/templates/:id", (_req, res) => {
    res.send(`Update template with id ${_req.params.id}`);
});

router.delete("/templates/:id", (_req, res) => {
    res.send(`Delete template with id ${_req.params.id}`);
});

export default router;