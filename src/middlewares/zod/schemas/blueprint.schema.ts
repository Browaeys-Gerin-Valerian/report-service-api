import { z } from "zod";
export const getOneBlueprintSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Blueprint ID is required"),
    }),
});

export const createBlueprintSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Blueprint name is required"),
        description: z.string().optional(),
        data_structure: z.record(z.any(), z.any()),
    }).strict()
});

export const updateBlueprintSchema = z.object({
    params: z.object({
        id: z.string().min(1, "blueprint ID is required"),
    }),
    body: z.object({
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        data_structure: z.record(z.any(), z.any()).optional(),
    }).strict()
});

export const deleteBlueprintSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Blueprint ID is required"),
    }),
}); 
