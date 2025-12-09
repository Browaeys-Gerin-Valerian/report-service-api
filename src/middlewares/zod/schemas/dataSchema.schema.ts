import { z } from "zod";

export const dataValueSchema: z.ZodType<any> = z.lazy(() =>
    z.union([
        dataText,
        dataObject,
        dataList,
        dataTable,
        dataImage,
    ])
);


const dataText = z.string();


const dataObject = z.object({
    fields: z.record(z.string(), dataValueSchema)
});


const dataList = z.object({
    items: z.array(dataValueSchema),
});

const dataImage = z.object({
    meta: z.object({
        filename: z.string(),
        width: z.number(),
        height: z.number()
    })
});


const dataTable = z.object({
    rows: z.array(
        z.union([
            dataText,
            dataObject,
            dataList,
        ])
    )
});

export const dataSchema = z.record(z.string(), dataValueSchema);


