import { IMAGE_PRESETS, ImagePreset } from "../../../../types";


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
