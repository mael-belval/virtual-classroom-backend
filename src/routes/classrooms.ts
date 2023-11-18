import { Router } from "express";

import { ClassroomService } from "../services/classroomService";
import { authMiddleware } from "../auth/authMiddleware";

const router = Router();

router.get("/", (_, res) => {
    res.send(ClassroomService.findAll());
});

router.get("/:id", (req, res) => {
    const classroom = ClassroomService.findById(req.params.id);
    if (classroom) {
        res.send(classroom);
    } else {
        res.sendStatus(404);
    }
});

router.post("/", authMiddleware, (req, res) => {
    const classroom = ClassroomService.create(req.body.questions);
    res.status(201).send(classroom);
});

router.delete("/:id", authMiddleware, (req, res) => {
    ClassroomService.deleteById(req.params.id);
    res.sendStatus(204);
});

export default router;
