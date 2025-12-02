import { ValidationError } from "../../../interfaces";
import { isObject } from "../../../utils/functions.utils";


type FieldType = "string" | "paragraph" | "list" | "table" | "image" | "object";


export async function validateData(
    data: Record<string, any>,
    data_structure: Record<string, any>,
    path: string[] = []
) {

    const errors: string[] = [];

    for (const key of Object.keys(data_structure)) {
        const fieldDef = data_structure[key];
        const value = data[key];
        const currentPath = [...path, key].join(".");


        // Vérifier required
        if (fieldDef.required && (value === undefined || value === null)) {
            errors.push(`Missing required field: ${currentPath}`);
            continue;
        }

        // Si le champ n'existe pas et n'est pas requis, skip
        if (value === undefined || value === null) continue;

        switch (fieldDef.type as FieldType) {
            case "string":
            case "paragraph":
                if (typeof value !== "string") {
                    errors.push(`Field ${currentPath} should be a string`);
                }
                break;

            case "object":
                if (!isObject(value)) {
                    errors.push(`Field ${currentPath} should be an object`);
                } else if (fieldDef.fields) {
                    await validateData(value, fieldDef.fields, [...path, key]);
                }
                break;

            case "list":
                if (!Array.isArray(value)) {
                    errors.push(`Field ${currentPath} should be an array`);
                } else if (fieldDef.items) {
                    for (let i = 0; i < value.length; i++) {
                        await validateData(
                            value[i],
                            { item: fieldDef.items },
                            [...path, key + `[${i}]`]
                        );
                    }
                }
                break;

            case "table":
                if (!Array.isArray(value)) {
                    errors.push(`Field ${currentPath} should be an array (table rows)`);
                } else if (fieldDef.columns) {
                    for (let i = 0; i < value.length; i++) {
                        const row = value[i];
                        for (const colKey of Object.keys(fieldDef.columns)) {
                            const colDef = fieldDef.columns[colKey];
                            const colValue = row[colKey];
                            const colPath = `${currentPath}[${i}].${colKey}`;
                            if (colDef.required && (colValue === undefined || colValue === null)) {
                                errors.push(`Missing required table column: ${colPath}`);
                            } else if (colValue !== undefined && typeof colValue !== "string") {
                                errors.push(`Table column ${colPath} should be a string`);
                            }
                        }
                    }
                }
                break;

            case "image":
                if (typeof value !== "string" && !isObject(value)) {
                    errors.push(`Field ${currentPath} should be an image (string or object)`);
                }
                break;

            default:
                errors.push(`Unknown field type for ${currentPath}: ${fieldDef.type}`);
        }
    }

    if (errors.length > 0) {
        throw new ValidationError("Data validation failed", errors);
    }
    return true;
}
