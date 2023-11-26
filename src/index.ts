import dotenv from "dotenv";
dotenv.config();

import express from "express";

import { app } from "./app";

const backend = express();

const { server, port } = app(backend);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
