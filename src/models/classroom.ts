import { Socket } from "socket.io";
import { z } from "zod";

export interface Classroom {
    id: string;
    title: string;
    questions: string[];
    sockets: Socket[];
}

export const createClassroomSchema = z.object({
    title: z.string(),
    questions: z.array(z.string()),
});
export type createClassroomModel = z.infer<typeof createClassroomSchema>;
