import multer from "multer";
import path from "path";
import fs from "fs";

const allowedExtensions = ['.docx', '.pdf'];

const TEMPLATE_DIR = path.join(process.cwd(), "templates");

// Ensure folder exists
if (!fs.existsSync(TEMPLATE_DIR)) {
    fs.mkdirSync(TEMPLATE_DIR);
}

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        console.log("Uploading to:", TEMPLATE_DIR);
        cb(null, TEMPLATE_DIR);
    },
    filename: (_, file, cb) => {
        console.log("Original file name:", file.originalname);
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

export const uploadTemplate = multer({
    storage, fileFilter: (_, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only .docx and .pdf files are allowed'));
        }
    }
});
