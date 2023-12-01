import { createLogger, format, transports } from "winston";

import { env } from "./env";

export const logger = createLogger({
    level: env.LOG_LEVEL,
    transports: [new transports.Console()],
    format: format.json(),
});
