import { Classroom, createClassroomModel } from "../models/classroom";
import { v4 as uuidv4 } from "uuid";
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
};
