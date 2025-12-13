import { ImagePreset } from "../../../../types";
import { DataImage, EnrichedDataImage } from "../../../../types/entity";
import { resolveImageSize } from "./resolveImageSize";

export function injectImg(id: string, width: number, height: number, preset: ImagePreset, caption: string, images: (DataImage | EnrichedDataImage)[]) {

    if (!images) return null;

    // 1. Find the image object by id
    const image = images.find(img => img.id === id);

    if (!image) return null;

    const { width: finalWidth, height: finalHeight } =
        resolveImageSize(width, height, preset);

    return {
        width: finalWidth,
        height: finalHeight,
        //@ts-ignore
        data: image.data,
        //@ts-ignore
        extension: image.extension,
        caption: caption || ""
    };

}
