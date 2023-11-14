import express from "express";
import classroomRoutes from "./routes/classrooms";

const app = express();
const port = 4000;

app.use(express.json());

app.use("/api/v1/classrooms", classroomRoutes);
app.use("/", (_, res) => {
    res.send("OK");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
