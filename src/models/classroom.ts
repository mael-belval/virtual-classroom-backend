import { Socket } from "socket.io";
import { z } from "zod";

export interface Classroom {
    id: string;
    title: string;
    questions: string[];
    sockets: Socket[];
}

export const createClassroomSchema = z.object({
    title: z.string().min(1),
    questions: z.array(z.string().min(1)).min(1),
});
export type createClassroomModel = z.infer<typeof createClassroomSchema>;
