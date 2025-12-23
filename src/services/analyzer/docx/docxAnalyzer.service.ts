import { DataStructureSchema } from "@custom_types/entity";
import { analyzePlaceholders } from "./utils/docxAnalyzer.utils";

export function docxAnalyzer(template: ArrayBuffer, data_structure: DataStructureSchema) {
    return analyzePlaceholders(template, data_structure);
}