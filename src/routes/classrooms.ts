import { Router } from "express";
import { z } from "zod";

import { ClassroomService } from "../services/classroomService";
import { authMiddleware } from "../auth/authMiddleware";
import { type Classroom, createClassroomSchema } from "../models/classroom";

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
    if (!classroom) {
        res.sendStatus(404);
        return;
    }
    res.send(classroomToClassroomResponse(classroom));
});

router.post("/", authMiddleware, (req, res) => {
    const classroomQuestions = createClassroomSchema.safeParse(req.body);
    if (!classroomQuestions.success) {
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

export { router };
