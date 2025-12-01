import { z } from "zod";

// Base (sans object)
const baseField = {
    type: z.enum(["string", "paragraph", "list", "table", "image"]),
    required: z.boolean().optional()
};

export const fieldSchema: z.ZodType<any> = z.lazy(() =>
    z.union([
        stringField,
        listField,
        objectField,
        tableField,
        imageField
    ])
);

// String / paragraph
const stringField = z.object({
    ...baseField,
    type: z.enum(["string", "paragraph"])
});

// Object
const objectField = z.object({
    ...baseField,
    type: z.literal("object"),
    fields: z.record(z.string(), z.lazy(() => fieldSchema))
});

// List
const listField = z.object({
    ...baseField,
    type: z.literal("list"),
    items: fieldSchema
});

// Table
const tableField = z.object({
    ...baseField,
    type: z.literal("table"),
    columns: z.record(z.string(), stringField)
});

// Image
const imageField = z.object({
    ...baseField,
    type: z.literal("image"),
    mimetypes: z.array(z.string()).optional(),
    max_size: z.number().optional()
});

// Schema final des data_structure
export const dataStructureSchema = z.record(z.string(), fieldSchema);
