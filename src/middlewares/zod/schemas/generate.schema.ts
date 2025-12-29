import { z } from "zod";
import { updateFileSchema } from "./file.schema";
import { config } from "@config/index";
const { ALLOWED_DOC_EXTENSION } = config;

const allowedOutputs = ALLOWED_DOC_EXTENSION.map(ext => ext.replace('.', ''));

export const generateSchema = z.object({
    body: z.object({
        data: z.object({
            template_id: z.string(),
            blueprint_id: z.string(),
            output_format: z.enum(allowedOutputs),
            data_to_insert: z.record(z.string(), z.any())
        })
    }),
    files: z.array(updateFileSchema.optional()),

})
