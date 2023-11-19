import express from "express";
import cors from "cors";
import { createServer } from "http";

import classroomRoutes from "./routes/classrooms";

import dotenv from "dotenv";
import { SocketManager } from "./services/socketManager";
dotenv.config();

const app = express();

const server = createServer(app);

SocketManager.init(server);

const port = 4000;

const corsOptions = process.env.NODE_ENV !== "production" ? undefined : { origin: process.env.FRONTEND_URL };
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/v1/classrooms", classroomRoutes);
app.use("/", (_, res) => {
    res.send("OK");
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
