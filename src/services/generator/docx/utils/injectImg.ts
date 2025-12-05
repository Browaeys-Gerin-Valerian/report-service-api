export async function injectImg(tag: string, data_to_insert: Record<string, any>) {
    const imageData = data_to_insert[tag];

    if (!imageData) return null;
    if (!imageData.meta || !imageData.meta.file) return null; // No associated file

    const { meta } = imageData

    const extension = meta.filename.split(".").pop()?.toLowerCase();

    return {
        width: meta.width,
        height: meta.height,
        data: meta.file.buffer,
        extension: `.${extension}`
    };
}
