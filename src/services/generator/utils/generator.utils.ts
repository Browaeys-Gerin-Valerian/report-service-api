import { ValidationError } from "../../../interfaces";
import { isObject } from "../../../utils/functions.utils";

type FieldType = "text" | "list" | "table" | "image" | "object";

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


        // --------------------------
        // REQUIRED
        // --------------------------
        if (fieldDef.required && (value === undefined || value === null)) {

            errors.push(`Missing required field: ${currentPath}`);
            continue;
        }

        // non-required  → skip
        if (value === undefined || value === null) continue;

        // --------------------------
        // DISPATCH BY TYPE
        // --------------------------
        switch (fieldDef.type as FieldType) {

            // ----------------------------------------
            // TEXT FIELD
            // ----------------------------------------
            case "text":
                if (typeof value !== "string") {
                    errors.push(`Field ${currentPath} should be a string`);
                }
                break;

            // ----------------------------------------
            // OBJECT FIELD
            // ----------------------------------------
            case "object":
                if (!isObject(value)) {
                    errors.push(`Field ${currentPath} should be an object`);
                    break;
                }

                if (!isObject(fieldDef.fields)) {
                    errors.push(`Object ${currentPath} is missing 'fields' definition`);
                    break;
                }
                const objectData = value.fields ?? value;

                await validateData(
                    objectData,
                    fieldDef.fields,
                    [...path, key]
                );
                break;

            // ----------------------------------------
            // LIST FIELD
            // ----------------------------------------
            case "list":
                if (!isObject(value) || !Array.isArray(value.items)) {
                    errors.push(`Field ${currentPath}.items should be an array`);
                    break;
                }

                value.items.forEach((itemValue, i) => {
                    const listDef = fieldDef.items[i];

                    if (!listDef) {
                        errors.push(`List field ${currentPath} is missing 'items' schema`);
                        return;
                    }

                    validateData(
                        { item: itemValue },
                        { item: listDef },
                        [...path, `${key}[${i}]`]
                    );
                });

                break;

            // ----------------------------------------
            // TABLE FIELD
            // ----------------------------------------
            case "table":
                if (!Array.isArray(value)) {
                    errors.push(`Field ${currentPath} should be an array of rows`);
                    break;
                }

                if (!isObject(fieldDef.columns)) {
                    errors.push(`Table ${currentPath} is missing 'columns' definition`);
                    break;
                }

                for (let i = 0; i < value.length; i++) {
                    const row = value[i];

                    if (!isObject(row)) {
                        errors.push(`Row ${currentPath}[${i}] should be an object`);
                        continue;
                    }

                    for (const colKey of Object.keys(fieldDef.columns)) {
                        const colSchema = fieldDef.columns[colKey];
                        const colValue = row[colKey];
                        const colPath = `${currentPath}[${i}].${colKey}`;

                        if (colSchema.required && (colValue === undefined || colValue === null)) {
                            errors.push(`Missing required column: ${colPath}`);
                            continue;
                        }

                        if (colValue !== undefined) {
                            await validateData(
                                { tmp: colValue },
                                { tmp: colSchema },
                                [...path, `${key}[${i}].${colKey}`]
                            );
                        }
                    }
                }
                break;

            // ----------------------------------------
            // IMAGE FIELD
            // ----------------------------------------
            case "image":
                if (typeof value !== "string") {
                    errors.push(`Field ${currentPath} should be a base64 string`);
                }
                break;

            // ----------------------------------------
            // UNKNOWN
            // ----------------------------------------
            default:
                errors.push(`Unknown field type for ${currentPath}: ${fieldDef.type}`);
        }
    }

    if (errors.length > 0) {
        throw new ValidationError("Data validation failed", errors);
    }

    return true;
}
