import { z } from "zod";
import { updateFileSchema } from "./file.schema";


const allowedExtensions = ['docx', 'pdf']

export const generateSchema = z.object({
    body: z.object({
        data: z.object({
            template_id: z.string(),
            blueprint_id: z.string(),
            output_format: z.enum(allowedExtensions),
            data_to_insert: z.record(z.string(), z.any())
        })
    }),
    files: z.array(updateFileSchema.optional()),

})
