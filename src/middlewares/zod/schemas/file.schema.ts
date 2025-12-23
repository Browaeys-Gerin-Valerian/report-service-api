// src/schemas/file.schema.ts
import { z } from "zod";

export const createFileSchema = z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string(),
    buffer: z.instanceof(Buffer),
    size: z.number(),
}).strict();

export const updateFileSchema = z.object({
    fieldname: z.string().optional(),
    originalname: z.string().optional(),
    encoding: z.string().optional(),
    mimetype: z.string().optional(),
    buffer: z.instanceof(Buffer).optional(),
    size: z.number().optional(),
}).strict();


