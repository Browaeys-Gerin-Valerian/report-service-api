import {
    BaseStructure,
    DataImage,
    DataList,
    DataObject,
    DataSchema,
    DataStructureSchema,
    DataTable,
    FieldType,
    ListStructure,
    ObjectStructure,
    TableStructure,
    ValidationError
} from "../../../types";
import { isObject } from "../../../utils/functions.utils";

export function validateData(
    data_structure: DataStructureSchema,
    data_to_insert: DataSchema,
    path: string[] = [],
) {
    const errors: string[] = [];

    const addError = (msg: string) => errors.push(msg);

    for (const key of Object.keys(data_structure)) {
        const fieldStructure = data_structure[key] as BaseStructure & { type: string };
        const fieldValue = data_to_insert[key];
        const currentPath = [...path, key].join(".");

        // --------------------------
        // REQUIRED
        // --------------------------
        if (fieldStructure.required && (fieldValue === undefined || fieldValue === null)) {
            addError(`Missing required field in ${currentPath}`);
            continue;
        }

        // --------------------------
        // NOT REQUIRED
        // --------------------------
        if (!fieldStructure.required && (fieldValue === undefined || fieldValue === null)) {
            continue;
        }

        // --------------------------
        // DISPATCH BY TYPE
        // --------------------------
        switch (fieldStructure.type as FieldType) {

            case "display":
                if (typeof fieldValue !== "boolean") {
                    addError(`Field ${currentPath} should be a boolean`);
                }
                break;

            case "text":
                if (typeof fieldValue !== "string") {
                    addError(`Field ${currentPath} should be a string`);
                }
                break;

            case "object":
                //Casting for typescript
                const dataObject = fieldValue as DataObject;
                const dataStructureObject = fieldStructure as ObjectStructure

                if (!isObject(dataStructureObject.fields)) {
                    addError(`Schema for object ${currentPath} is missing 'fields'`);
                    break;
                }
                if (!isObject(dataObject.fields)) {
                    addError(`Value for ${currentPath} is missing 'fields'`);
                    break;
                }

                validateData(dataStructureObject.fields, dataObject.fields, [...path, key]);
                break;

            case "list":
                //Casting for typescript
                const dataList = fieldValue as DataList;
                const dataStructureList = fieldStructure as ListStructure

                if (!Array.isArray(dataStructureList.items)) {
                    addError(`Schema for list ${currentPath} is missing 'items'`);
                    break;
                }

                if (!Array.isArray(dataList.items)) {
                    addError(`Value for ${currentPath} is missing 'items'`);
                    break;
                }

                dataStructureList.items.forEach((itemStructure, i) => {
                    const itemValue = dataList.items[i]
                    validateData(
                        { items: itemStructure },
                        { items: itemValue },
                        [...path, `${key}`]
                    );
                });
                break;

            case "table":
                //Casting for typescript
                const dataTable = fieldValue as DataTable;
                const dataStructureTable = fieldStructure as TableStructure;


                if (!Array.isArray(dataStructureTable.rows)) {
                    addError(`Schema ${currentPath} is missing 'rows'`);
                    break;
                }

                if (!Array.isArray(dataTable.rows)) {
                    addError(`Value for ${currentPath} is missing 'rows'`);
                    break;
                }

                dataStructureTable.rows.forEach((itemStructure, i) => {
                    const itemValue = dataTable.rows[i]

                    validateData(
                        { rows: itemStructure },
                        { rows: itemValue },
                        [...path, `${key}`]
                    );
                });
                break;

            case "image":
                //Casting for typescript
                const dataImage = fieldValue as DataImage;

                if (!isObject(dataImage?.meta)) {
                    addError(`Field ${currentPath}.meta should be an object`);
                    break;
                }

                if (typeof dataImage.meta.filename !== "string") {
                    addError(`Field ${currentPath}.meta.filename should be a string`);
                }

                if (dataImage.meta.width !== undefined && typeof dataImage.meta.width !== "number") {
                    addError(`Field ${currentPath}.meta.width should be a number`);
                }

                if (dataImage.meta.height !== undefined && typeof dataImage.meta.height !== "number") {
                    addError(`Field ${currentPath}.meta.height should be a number`);
                }
                break;

            default:
                addError(`Unknown field type for ${currentPath}: ${fieldStructure.type}`);
        }
    }

    if (errors.length > 0) {
        throw new ValidationError("Data validation failed", errors);
    }

    return true;
}
