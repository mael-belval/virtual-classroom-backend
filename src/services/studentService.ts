import { SocketManager } from "./socketManager";
import { ClassroomService } from "./classroomService";
import { z } from "zod";

export const StudentService = {
    init: () => {
        SocketManager.getIO().on("connection", (socket) => {
            socket.emit("ending misconfigurated connection");
            socket.disconnect();
        });
        SocketManager.getIO()
            .of(/^\/classrooms\/\w{8}-(\w{4}-){3}\w{12}$/)
            .on("connection", (socket): void => {
                const namespace = socket.nsp;
                const classroomId = namespace.name.split("/")[2];
                const classroom = ClassroomService.findById(classroomId);
                if (classroom) {
                    classroom.sockets.push(socket);
                } else {
                    console.error("classroom not found", classroomId);
                    socket.emit("ending misconfigurated connection");
                    socket.disconnect();
                    return;
                }
                console.log("new connection");

                socket.on("disconnect", () => {
                    console.log("disconnect", socket.data.email);
                    if (classroom) {
                        classroom.sockets = classroom.sockets.filter(
                            (s) => s.id !== socket.id
                        );
                    }
                });

                // socket.onAny((event, ...args) => {
                //     console.log(event, args);
                //     namespace.to("admin").emit(event, ...args);
                // });

                socket.once("join", (data) => {
                    console.log("join handler", "join", data);
                    const email = z
                        .string()
                        .regex(/^\w+\.\w+@etu\.utc\.fr$/)
                        .safeParse(data);
                    if (data !== process.env.ADMIN_EMAIL && !email.success) {
                        console.error("join handler", "email not valid", data);
                        socket.emit("ending misconfigurated connection");
                        socket.disconnect();
                        return;
                    }
                    const emailValue = email.success ? email.data : data;
                    socket.data.email = emailValue;
                    if (
                        classroom.sockets.some(
                            (s) =>
                                s.data.email === emailValue &&
                                s.id !== socket.id
                        )
                    ) {
                        console.error(
                            "join handler",
                            "email already used",
                            data
                        );
                        socket.emit("ending misconfigurated connection");
                        socket.disconnect();
                        return;
                    } else {
                        if (data === process.env.ADMIN_EMAIL) {
                            socket.join("admin");
                        } else {
                            socket.join("student");
                        }
                    }
                });

                socket.on("question", async (data) => {
                    const index = z.number().safeParse(data);

                    if (!index.success) return;

                    if (classroom.questions.length <= index.data) return;

                    socket.data.currentQuestionIndex = index.data;

                    const students = await namespace
                        .in("student")
                        .fetchSockets();

                    const state = students.map((s) => ({
                        email: s.data.email,
                        currentQuestionIndex: s.data.currentQuestionIndex,
                    }));

                    console.log("question handler", state);
                    namespace.to("admin").emit("state", state);
                });
            });
    },
};
