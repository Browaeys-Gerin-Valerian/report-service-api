import {
    BaseStructure,
    DataImage,
    DataCollection,
    DataObject,
    DataSchema,
    DataStructureSchema,
    DataStructureCollection,
    DataStructureObject,
} from "../../../types/entity";
import { FieldType } from "../../../types";
import { isObject, ValidationError } from "../../../utils/functions.utils";

export function validateData(
    data_structure: DataStructureSchema,
    data_to_insert: DataSchema,
    files: Express.Multer.File[],
    errors: string[] = [],
    path: string[] = [],
) {

    const addError = (msg: string) => errors.push(msg)

    for (const key of Object.keys(data_structure)) {
        const fieldStructure = data_structure[key] as BaseStructure & { type: string };
        const fieldValue = data_to_insert[key];
        const currentPath = [...path, key].join(".");

        // --------------------------
        // REQUIRED
        // --------------------------
        if (fieldStructure.required && (fieldValue === undefined || fieldValue === null)) {
            addError(`Missing required field ${currentPath}`);
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

            case "text":
                if (typeof fieldValue !== "string") {
                    addError(`Field ${currentPath} should be a string`);
                }
                break;

            case "object":
                //Casting for typescript
                const dataStructureObject = fieldStructure as DataStructureObject
                const dataObject = fieldValue as DataObject;

                if (!isObject(dataStructureObject.fields)) {
                    addError(`Schema for object ${currentPath} is missing 'fields'`);
                    break;
                }
                if (!isObject(dataObject.fields)) {
                    addError(`Value for ${currentPath} is missing 'fields'`);
                    break;
                }

                validateData(dataStructureObject.fields, dataObject.fields, files, errors, [...path, key]);
                break;

            case "collection":
                //Casting for typescript

                const dataStructureList = fieldStructure as DataStructureCollection
                const dataList = fieldValue as DataCollection;

                if (!Array.isArray(dataStructureList.items)) {
                    addError(`Schema for list ${currentPath} is missing 'items'`);
                    break;
                }

                if (!Array.isArray(dataList.items)) {
                    addError(`Value for ${currentPath} is missing 'items'`);
                    break;
                }

                if (dataList.items.length === 0) {
                    addError(`List ${currentPath}.items should not be empty`);
                    break;
                }

                dataStructureList.items.forEach((itemStructure, i) => {
                    const itemValue = dataList.items[i]
                    validateData(
                        { items: itemStructure },
                        { items: itemValue },
                        files,
                        errors,
                        [...path, `${key}`]
                    );
                });
                break;


            case "image":
                //Casting for typescript
                const dataImage = fieldValue as DataImage;

                if (!isObject(dataImage)) {
                    addError(`Field ${currentPath} should be an object`);
                    break;
                }

                if (typeof dataImage.filename !== "string") {
                    addError(`Field ${currentPath}.filename should be a string`);
                }

                const file = files.find(file => file.originalname === dataImage.filename)

                if (!file) {
                    addError(`Image ${currentPath} doesn't have matching file`);
                    break;
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
