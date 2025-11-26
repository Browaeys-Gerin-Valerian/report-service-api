import multer from "multer";
import path from "path";
import fs from "fs";
import { config } from "../config";
const { TEMPLATE_DIR } = config;

const allowedExtensions = ['.docx', '.pdf'];



// Ensure folder exists
if (!fs.existsSync(TEMPLATE_DIR)) {
    fs.mkdirSync(TEMPLATE_DIR);
}

export const uploadTemplate = multer({
    storage: multer.memoryStorage(),
    fileFilter: (_, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only .docx and .pdf files are allowed'));
        }
    }
});
