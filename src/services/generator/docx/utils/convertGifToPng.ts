import sharp from "sharp";

/**
 * Converts GIF images to PNG format for better PDF compatibility
 * LibreOffice has issues rendering GIFs in PDF conversion
 */
export async function convertGifToPng(imageBuffer: Buffer): Promise<{ data: Buffer; extension: string }> {
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