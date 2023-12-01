import { config } from "dotenv";
config();

import express from "express";

import { app } from "./app";
import { logger } from "./config/log";

const backend = express();

const { server, port } = app(backend);

server.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});
