import { ImagePreset } from "@custom_types/index";
import { DataImage, EnrichedDataImage } from "@custom_types/entity";
import { resolveImageSize } from "./resolveImageSize";
import { convertGifToPng } from "./convertGifToPng";


export async function injectImg(id: string, images: (DataImage | EnrichedDataImage)[], width: number, height: number, preset: ImagePreset, caption: string) {

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
