import { z } from "zod";

const base = {
    required: z.boolean(),
}

export const fieldSchema: z.ZodType<any> = z.lazy(() =>
    z.union([
        dataStructureText,
        dataStructureObject,
        dataStructureCollection,
        dataStructureImage,
    ])
);


const dataStructureText = z.object({
    ...base,
    type: z.literal("text")
})

const dataStructureObject = z.object({
    ...base,
    type: z.literal("object"),
    fields: z.record(z.string(), fieldSchema)
});


const dataStructureCollection = z.object({
    ...base,
    type: z.literal("collection"),
    items: z.array(fieldSchema),
});


const dataStructureImage = z.object({
    ...base,
    type: z.literal("image"),
}).strict();


export const dataStructureSchema = z.record(z.string(), z.union([fieldSchema]));