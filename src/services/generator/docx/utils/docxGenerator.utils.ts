import sharp from "sharp";
import { DataImage, DataSchema, EnrichedDataImage } from "@custom_types/entity";
import { ImagePreset, IMAGE_PRESETS } from "@custom_types/index";
import { ValidationError } from "@utils/functions.utils";


// =============================================================================
// IMAGE COLLECTION & RESOLUTION
// =============================================================================

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


// =============================================================================
// IMAGE SIZE & PRESET RESOLUTION
// =============================================================================

export function resolveImageSize(
    width?: number,
    height?: number,
    preset?: ImagePreset
): { width: number; height: number } {

    if ((width !== undefined && height !== undefined) && (String(width) !== "0" && String(height) !== "0")) {
        return { width, height };
    }

    return {
        width: IMAGE_PRESETS[preset || "medium"].width,
        height: IMAGE_PRESETS[preset || "medium"].height,
    };
}


// =============================================================================
// IMAGE CONVERSION
// =============================================================================
export async function convertGifToPng(imageBuffer: Buffer): Promise<{ data: Buffer; extension: string }> {
    /**
 * Converts GIF images to PNG format for better PDF compatibility
 * LibreOffice has issues rendering GIFs in PDF conversion
 */
    try {
        const pngBuffer = await sharp(imageBuffer)
            .png()
            .toBuffer();

        return {
            data: pngBuffer,
            extension: ".png"
        };
    } catch (err) {
        console.warn("Failed to convert GIF to PNG, using original:", err);
        return {
            data: imageBuffer,
            extension: ".gif"
        };
    }
}

// =============================================================================
// IMAGE INJECTION 
// =============================================================================

export async function injectImg(id: string, path: string, width: number, height: number, preset: ImagePreset, caption: string, images: (DataImage | EnrichedDataImage)[]) {

    if (!images) return null;

    const image = images.find(img => img.id === id);

    if (!image) return null;

    const { width: finalWidth, height: finalHeight } =
        resolveImageSize(width, height, preset);

    //@ts-ignore
    let imageData = image.data;
    //@ts-ignore
    let imageExtension = image.extension;

    // Convert GIF to PNG for better PDF compatibility
    if (imageExtension === ".gif") {
        const converted = await convertGifToPng(imageData);
        imageData = converted.data;
        imageExtension = converted.extension;
    }

    return {
        width: finalWidth,
        height: finalHeight,
        data: imageData,
        extension: imageExtension,
        caption: caption || ""
    };

}


