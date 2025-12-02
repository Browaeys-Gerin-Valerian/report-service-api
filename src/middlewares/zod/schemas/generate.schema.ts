import { z } from "zod";

const allowedExtensions = ['docx', 'pdf']

export const generateSchema = z.object({
    body: z.object({
        template_id: z.string(),
        blueprint_id: z.string(),
        output_format: z.enum(allowedExtensions),
        data: z.record(z.string(), z.any())
    })
})
