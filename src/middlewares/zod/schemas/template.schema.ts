import { z } from "zod";
import { createFileSchema, updateFileSchema } from "./file.schema";


export const getOneTemplateSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Template ID is required"),
    }),
});

export const createTemplateSchema = z.object({
    body: z.object({
        data: z.object({
            blueprint_id: z.string().min(1, "Blueprint ID is required"),
            name: z.string().min(1, "Template name is required"),
            default: z.boolean().optional(),
            language: z.string().min(1, "Language is required"),
        }).strict()
    }).strict(),
    file: createFileSchema,
});

export const updateTemplateSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Template ID is required"),
    }),
    body: z.object({
        data: z.object({
            name: z.string().min(1).optional(),
            default: z.boolean().optional(),
            language: z.string().optional(),
        }).strict().optional()
    }).optional(),

    file: updateFileSchema.optional(),
});

export const deleteTemplateSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Template ID is required"),
    }),
}); 
