import { z } from "zod";

const base = {
    required: z.boolean().optional(),
}


export const fieldSchema: z.ZodType<any> = z.lazy(() =>
    z.union([
        text,
        object,
        list,
        table,
        image,
    ])
);

const text = z.object({
    ...base,
    type: z.literal("text")
})

const object = z.object({
    ...base,
    type: z.literal("object"),
    fields: z.record(z.string(), fieldSchema)
});


const list = z.object({
    ...base,
    type: z.literal("list"),
    items: z.array(fieldSchema),
});


const image = z.object({
    ...base,
    type: z.literal("image"),
}).strict();

const table = z.object({
    ...base,
    type: z.literal("table"),
    columns: z.record(z.string(), z.union([
        text,
        object,
        list,
        image
    ]))
});



// data_structure final
export const dataStructureSchema = z.record(z.string(), fieldSchema);

