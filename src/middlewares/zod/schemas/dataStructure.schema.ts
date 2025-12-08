import { z } from "zod";

const base = {
    required: z.boolean(),
}

export const fieldSchema: z.ZodType<any> = z.lazy(() =>
    z.union([
        displayFlag,
        text,
        object,
        list,
        table,
        image,
    ])
);

const displayFlag = z.object({
    type: z.literal("display")
});

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
    columns: z.array(
        z.union([
            text,
            object,
            list,

        ])
    )
});

export const dataStructureSchema = z.record(z.string(), z.union([fieldSchema, displayFlag]));