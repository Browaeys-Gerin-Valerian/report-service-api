import multer from "multer";
import path from "path";
import fs from "fs";
import { config } from "../../config";
const { TEMPLATE_DIR, ALLOWED_DOC_EXTENSION, ALLOWED_IMG_EXTENSION } = config;

const allowedExtensions = [...ALLOWED_DOC_EXTENSION, ...ALLOWED_IMG_EXTENSION];



// Ensure folder exists
if (!fs.existsSync(TEMPLATE_DIR)) {
    fs.mkdirSync(TEMPLATE_DIR);
}

export const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (_, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error(`Only ${allowedExtensions} files are allowed`));
        }
    }
});
