import { json, type Express } from "express";
import { createServer } from "http";
import { SocketManager } from "./services/socketManager";
import cors from "cors";

import classroomRoutes from "./routes/classrooms";
import { env } from "./config/env";
import { StudentService } from "./services/studentService";

export const app = (app: Express) => {
    const server = createServer(app);

    const corsOptions = { origin: process.env.FRONTEND_URL };

    SocketManager.init(server, { cors: corsOptions });

    StudentService.init();

    app.use(cors(corsOptions));

    app.use(json());

    app.use("/api/v1/classrooms", classroomRoutes);

    app.use("/", (_, res) => {
        res.send("OK");
    });

    return { server, port: env.PORT };
};
