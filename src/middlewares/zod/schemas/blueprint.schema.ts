import { z } from "zod";
import { dataStructureSchema } from "./dataStructure.schema"
export const getOneBlueprintSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Blueprint ID is required"),
    }),
    query: z.object({
        withTemplates: z.coerce.boolean().optional(),
    })
});

export const createBlueprintSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Blueprint name is required"),
        description: z.string().optional(),
        data_structure: dataStructureSchema,
    }).strict()
});

export const updateBlueprintSchema = z.object({
    params: z.object({
        id: z.string().min(1, "blueprint ID is required"),
    }),
    body: z.object({
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        data_structure: dataStructureSchema.optional(),
    }).strict()
});

export const deleteBlueprintSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Blueprint ID is required"),
    }),
}); 
