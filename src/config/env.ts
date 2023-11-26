import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(4000),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    JWT_SECRET: z.string(),
    FRONTEND_URL: z.string().url(),
    ADMIN_EMAIL: z.string().email(),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
