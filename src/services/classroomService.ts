import { Classroom } from "../models/classroom";
import { v4 as uuidv4 } from "uuid";

let classrooms: Classroom[] = [];

export const ClassroomService = {
    findAll: (): Classroom[] => {
        return classrooms;
    },

    findById: (id: string): Classroom | undefined => {
        return classrooms.find((c) => c.id === id);
    },

    create: (questions: string[]): Classroom => {
        const newClassroom: Classroom = {
            id: uuidv4(),
            questions,
        };
        classrooms.push(newClassroom);
        return newClassroom;
    },

    deleteById: (id: string): void => {
        classrooms = classrooms.filter((c) => c.id !== id);
    },
};
