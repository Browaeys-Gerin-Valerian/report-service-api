
import mammoth from "mammoth";
import puppeteer, { PaperFormat } from "puppeteer";

export interface IPDFOptions {
    format: PaperFormat;
    printBackground: boolean;
    margin: {
        top: string;
        right: string;
        bottom: string;
        left: string;
    };
}

const PDF_OPTIONS: IPDFOptions = {
    format: 'A4',
    printBackground: true,
    margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
    }
};


export async function generate(
    docxBuffer: Uint8Array<ArrayBufferLike>
) {
    // Step 1: Convert DOCX to HTML (ensure buffer is Buffer type)
    const { value: html } = await mammoth.convertToHtml({
        buffer: Buffer.from(docxBuffer)
    });

    // Step 2: Convert HTML to PDF using puppeteer
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();

        // Set HTML content with proper styling
        await page.setContent(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 40px;
                        line-height: 1.6;
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                    }
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `, { waitUntil: 'networkidle0' });

        // Generate PDF
        const pdfBuffer = await page.pdf(PDF_OPTIONS);

        return Buffer.from(pdfBuffer);
    } finally {
        await browser.close();
    }
};
