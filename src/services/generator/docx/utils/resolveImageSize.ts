import { IMAGE_PRESETS, ImagePreset } from "../../../../types";


export function resolveImageSize(
    width?: number,
    height?: number,
    preset?: ImagePreset
): { width: number; height: number } {

    if ((width !== undefined && height !== undefined) && (Number(width) && Number(height))) {
        return { width, height };
    }

    return {
        width: IMAGE_PRESETS[preset || "medium"].width,
        height: IMAGE_PRESETS[preset || "medium"].height,
    };
}
