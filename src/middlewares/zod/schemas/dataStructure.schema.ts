import { z } from "zod";

// Base (sans le champ "type", défini par les sous-schemas)
const baseField = {
    required: z.boolean().optional()
};

// ---- Déclarations anticipées ----
export const fieldSchema: z.ZodType<any> = z.lazy(() =>
    z.union([
        stringField,
        paragraphField,
        objectField,
        listField,
        tableField,
        imageField
    ])
);

// ---- Champs individuels ----

// string
const stringField = z.object({
    ...baseField,
    type: z.literal("string")
});

// paragraph (même nature que string mais sémantique différente)
const paragraphField = z.object({
    ...baseField,
    type: z.literal("paragraph")
});

// object
const objectField = z.object({
    ...baseField,
    type: z.literal("object"),
    fields: z.record(z.string(), fieldSchema)
});

// list
const listField = z.object({
    ...baseField,
    type: z.literal("list"),
    items: fieldSchema
});

// table
const tableField = z.object({
    ...baseField,
    type: z.literal("table"),
    columns: z.record(z.string(), stringField) // table = uniquement strings dans ta logique
});

// image
const imageField = z.object({
    ...baseField,
    type: z.literal("image"),
    mimetypes: z.array(z.string()).optional(),
    max_size: z.number().optional()
});

// data_structure final
export const dataStructureSchema = z.record(z.string(), fieldSchema);

