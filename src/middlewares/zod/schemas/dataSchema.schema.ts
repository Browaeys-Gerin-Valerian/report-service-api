import { z } from "zod";

export const dataValueSchema: z.ZodType<any> = z.lazy(() =>
    z.union([
        dataText,
        dataObject,
        dataCollection,
        dataImage,
    ])
);


const dataText = z.string();


const dataObject = z.object({
    fields: z.record(z.string(), dataValueSchema)
});


const dataCollection = z.object({
    items: z.array(dataValueSchema),
});

const dataImage = z.object({
    id: z.string(),
    filename: z.string(),
});


export const dataSchema = z.record(z.string(), dataValueSchema);


