import fs from "fs";
import XlsxTemplate from "xlsx-template";
import { DataSchema } from "@custom_types/entity";
import { ValidationError } from "@utils/functions.utils";
import { transformDataForXlsx } from "./utils/xlsx.utils";


export async function generate(
    templatePath: string,
    data_to_insert: DataSchema,
): Promise<Buffer> {
    try {
        const templateBuffer = fs.readFileSync(templatePath);

        const template = new XlsxTemplate(templateBuffer);

        const transformedData = transformDataForXlsx(data_to_insert);

        template.substitute(1, transformedData); // 1 = first sheet (can be parameterized if needed)

        const buffer = template.generate({ type: "nodebuffer" });

        return buffer;
    } catch (error) {
        throw new ValidationError(`Error filling XLSX: ${error}`);
    }
}
