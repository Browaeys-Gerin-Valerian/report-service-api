import { DataImage, DataSchema, EnrichedDataImage } from "../../../../types/entity";
import { ValidationError } from "../../../../utils/functions.utils";


/**
 * Recursively collects all objects with 'id' and 'filename' into a flat array.
*/
export function collectImagesArray(
    data: DataSchema | null | undefined,
    result: DataImage[] = []
): DataImage[] {

    if (!data || typeof data !== "object") return result;

    if ("id" in data && "filename" in data) {
        result.push(data as DataImage);
        return result;
    }

    if ("fields" in data && typeof data.fields === "object") {
        for (const key in data.fields) {
            //@ts-ignore
            collectImagesArray(data.fields[key], result);
        }
        return result;
    }

    if ("items" in data && Array.isArray(data.items)) {
        for (const item of data.items) {
            collectImagesArray(item, result);
        }
        return result;
    }

    for (const key of Object.keys(data)) {
        const child = (data as Record<string, any>)[key];
        if (typeof child === "object") {
            collectImagesArray(child, result);
        }
    }

    return result;
}




export function resolveImages(
    data_to_insert: DataSchema,
    files: Express.Multer.File[]
): (DataImage | EnrichedDataImage)[] {

    const images = collectImagesArray(data_to_insert);

    // Detect duplicate IDs
    const seen = new Set<string>();
    const duplicates: string[] = [];

    for (const img of images) {
        if (seen.has(img.id)) {
            duplicates.push(img.id);
        } else {
            seen.add(img.id);
        }
    }

    if (duplicates.length > 0) {
        throw new ValidationError(
            `Duplicate image IDs detected: ${duplicates.join(", ")}`
        );
    }

    return images.map(img => {
        const file = files.find(f => f.originalname === img.filename);
        if (!file) return img;

        return {
            ...img,
            originalname: file.originalname,
            data: file.buffer,
            extension: '.' + (img.filename.split('.').pop() || 'jpg')
        };
    });
}




