import { onClassroomConnection } from "../routes/classroomSocket";

import { SocketManager } from "./socketManager";

export const StudentService = {
    init: () => {
        SocketManager.getIO().on("connection", (socket) => {
            socket.emit("ending misconfigurated connection");
            socket.disconnect();
        });
        SocketManager.getIO()
            .of(/^\/classrooms\/\w{8}-(\w{4}-){3}\w{12}$/)
            .on("connection", onClassroomConnection);
    },
};
