// src/schemas/file.schema.ts
import { z } from "zod";

export const fileSchema = z.object({
    fieldname: z.string().optional(),
    originalname: z.string().optional(),
    encoding: z.string().optional(),
    mimetype: z.string().optional(),
    buffer: z.instanceof(Buffer).optional(),
    size: z.number().optional(),
}).strict();


export type UploadedFile = z.infer<typeof fileSchema>;
