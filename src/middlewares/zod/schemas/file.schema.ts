// src/schemas/file.schema.ts
import { z } from "zod";

export const fileSchema = z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string(),
    buffer: z.instanceof(Buffer),
    size: z.number().max(5_000_000, "File must be < 5MB"),
}).strict();

export type UploadedFile = z.infer<typeof fileSchema>;
