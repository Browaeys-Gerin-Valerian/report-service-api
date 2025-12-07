import { ValidationError } from "../../../types";


export function resolveImages(data: any, files: Express.Multer.File[]) {
    walk(data);

    function walk(node: any) {

        if (!node || typeof node !== "object") return;

        if (node.meta && node.meta.filename) {
            const file = files.find(f => f.originalname === node.meta.filename);

            if (!file) {
                throw new ValidationError(`Image file '${node.meta.filename}' not found in uploaded files`);
            }

            node.meta.file = file;
            return;
        }
        for (const key in node) {
            walk(node[key]);
        }
    }
}
