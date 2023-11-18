import express from "express";
import cors from "cors";
import classroomRoutes from "./routes/classrooms";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 4000;

app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use("/api/v1/classrooms", classroomRoutes);
app.use("/", (_, res) => {
    res.send("OK");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
