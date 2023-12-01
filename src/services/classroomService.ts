import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import type { Socket } from "socket.io";

import { type Classroom, createClassroomModel } from "../models/classroom";
import { logger } from "../config/log";
import { emailSchema } from "../models/email";
import { env } from "../config/env";

import { SocketManager } from "./socketManager";

let classrooms: Classroom[] = [];

export const ClassroomService = {
    findAll: (): Classroom[] => {
        return classrooms;
    },

    findById: (id: string): Classroom | undefined => {
        return classrooms.find((c) => c.id === id);
    },

    create: (createClassroom: createClassroomModel): Classroom => {
        const newClassroom: Classroom = {
            id: uuidv4(),
            title: createClassroom.title,
            questions: createClassroom.questions,
            sockets: [],
        };
        classrooms.push(newClassroom);
        return newClassroom;
    },

    deleteById: (id: string): boolean => {
        const originalLength = classrooms.length;

        SocketManager.getIO().of(`/classrooms/${id}`).disconnectSockets(true);

        classrooms = classrooms.filter((c) => c.id !== id);
        return classrooms.length !== originalLength;
    },

    onDisconnect:
        (classroom: Classroom, socket: Socket, callback: Function) =>
        async () => {
            logger.info(
                "disconnect",
                socket.data.email ? { email: socket.data.email } : undefined
            );
            if (classroom) {
                classroom.sockets = classroom.sockets.filter(
                    (s) => s.id !== socket.id
                );
            }

            await callback();
        },

    onJoin:
        (classroom: Classroom, socket: Socket, callback: Function) =>
        async (data: string) => {
            logger.info("join event", { data });
            const email = emailSchema.safeParse(data);

            if (data !== env.ADMIN_EMAIL && !email.success) {
                logger.error("join error - email not valid", { data });
                socket.emit("ending misconfigurated connection");
                socket.disconnect();
                return;
            }

            const emailValue = email.success ? email.data : data;
            socket.data.email = emailValue;
            if (
                classroom.sockets.some(
                    (s) => s.data.email === emailValue && s.id !== socket.id
                )
            ) {
                logger.error("join error - email already used", {
                    data,
                });
                socket.emit("ending misconfigurated connection");
                socket.disconnect();
                return;
            }

            if (data === env.ADMIN_EMAIL) {
                socket.join("admin");
            } else {
                socket.join("student");
                socket.data.currentQuestionIndex = 0;
            }

            await callback();
        },

    onQuestion:
        (classroom: Classroom, socket: Socket, callback: Function) =>
        async (data: number) => {
            logger.info("question handler", { data });

            const index = z.number().positive().safeParse(data);

            if (!index.success) return;
            if (classroom.questions.length <= index.data) return;

            socket.data.currentQuestionIndex = index.data;

            await callback();
        },
};
