import type { Socket } from "socket.io";

import { ClassroomService } from "../services/classroomService";
import { logger } from "../config/log";

export const onClassroomConnection = (socket: Socket): void => {
    const namespace = socket.nsp;
    const classroomId = namespace.name.split("/")[2];
    const classroom = ClassroomService.findById(classroomId);

    if (!classroom) {
        logger.error("classroom not found", { classroomId });
        socket.emit("ending misconfigurated connection");
        socket.disconnect();
        return;
    }

    classroom.sockets.push(socket);
    logger.info("new connection", { socket });

    const refreshState = async () => {
        const students = await namespace.in("student").fetchSockets();

        const state = students.map((s) => ({
            email: s.data.email,
            currentQuestionIndex: s.data.currentQuestionIndex,
        }));

        namespace.to("admin").emit("state", state);
    };

    socket.on(
        "disconnect",
        ClassroomService.onDisconnect(classroom, socket, refreshState)
    );
    socket.once(
        "join",
        ClassroomService.onJoin(classroom, socket, refreshState)
    );
    socket.on(
        "question",
        ClassroomService.onQuestion(classroom, socket, refreshState)
    );
};
