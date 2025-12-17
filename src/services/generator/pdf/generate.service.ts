
import { exec } from "child_process";
import { promisify } from "util";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const execAsync = promisify(exec);

/**
 * Converts a DOCX buffer to PDF using LibreOffice
 * Preserves all formatting, colors, styles, and images
 * 
 * Requirements:
 * - Local dev: Install LibreOffice (https://www.libreoffice.org/download)
 * - Docker: Add to Dockerfile (see instructions below)
 * - Production: Ensure LibreOffice is installed on server
 */
export async function generate(
    docxBuffer: Uint8Array<ArrayBufferLike>
) {
    const tempDir = path.join(process.cwd(), 'temp');
    const tempId = randomUUID();
    const inputPath = path.join(tempDir, `${tempId}.docx`);
    const outputPath = path.join(tempDir, `${tempId}.pdf`);

    try {
        // Create temp directory if it doesn't exist (cross-platform solution)
        await mkdir(tempDir, { recursive: true }).catch(() => { });

        // Write DOCX buffer to temporary file
        await writeFile(inputPath, Buffer.from(docxBuffer));

        // Convert DOCX to PDF using LibreOffice
        // --headless: Run without GUI
        // --convert-to pdf: Output format
        // --outdir: Output directory
        const command = process.platform === 'win32'
            ? `"C:\\Program Files\\LibreOffice\\program\\soffice.exe" --headless --convert-to pdf --outdir "${tempDir}" "${inputPath}"`
            : `libreoffice --headless --convert-to pdf --outdir "${tempDir}" "${inputPath}"`;

        await execAsync(command, { timeout: 30000 });

        // Read the generated PDF
        const fs = await import('fs/promises');
        const pdfBuffer = await fs.readFile(outputPath);

        return Buffer.from(pdfBuffer);
    } finally {
        // Cleanup temporary files
        await unlink(inputPath).catch(() => { });
        await unlink(outputPath).catch(() => { });
    }
};
