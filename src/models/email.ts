import { z } from "zod";

export const emailSchema = z.string().regex(/^\w+\.\w+@etu\.utc\.fr$/);
