import { DataSchema } from "@custom_types/entity";
import { ITemplate } from "@custom_types/entity";
import { getTemplatePath } from "@utils/functions.utils";
import { generate } from "./generate.service";

export async function xlsxGenerator(
    template: ITemplate,
    data_to_insert: DataSchema,
) {
    const templatePath = getTemplatePath(template.filename)
    return generate(templatePath, data_to_insert);
}
