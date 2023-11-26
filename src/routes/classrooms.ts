import { Router } from "express";

import { ClassroomService } from "../services/classroomService";
import { authMiddleware } from "../auth/authMiddleware";
import { Classroom, createClassroomSchema } from "../models/classroom";
import { z } from "zod";

type ClassroomResponse = Omit<Classroom, "sockets">;

const classroomToClassroomResponse = (
    classroom: Classroom
): ClassroomResponse => {
    return {
        id: classroom.id,
        title: classroom.title,
        questions: classroom.questions,
    };
};

const router = Router();

router.get("/", (_, res) => {
    res.send(ClassroomService.findAll().map(classroomToClassroomResponse));
});

router.get("/:id", (req, res) => {
    const id = z.string().uuid().safeParse(req.params.id);
    if (!id.success) {
        res.status(400).send(id.error);
        return;
    }
    const classroom = ClassroomService.findById(id.data);
    if (classroom) {
        res.send(classroomToClassroomResponse(classroom));
    } else {
        res.sendStatus(404);
    }
});

router.post("/", authMiddleware, (req, res) => {
    const classroomQuestions = createClassroomSchema.safeParse(req.body);

    if (!classroomQuestions.success) {
        console.error(classroomQuestions.error);
        res.status(400).send(classroomQuestions.error);
        return;
    }

    const classroom = ClassroomService.create(classroomQuestions.data);

    res.status(201).send(classroomToClassroomResponse(classroom));
});

router.delete("/:id", authMiddleware, (req, res) => {
    const id = z.string().uuid().safeParse(req.params.id);
    if (!id.success) {
        res.status(400).send(id.error);
        return;
    }
    const deletionSuccess = ClassroomService.deleteById(id.data);

    if (!deletionSuccess) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
});

export default router;
