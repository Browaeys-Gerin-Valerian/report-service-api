import fs from "fs";
import { listCommands } from "docx-templates";
import { DataStructureSchema } from "@custom_types/entity";
import { config } from "@config/index";


const { TEMPLATE_CMD_DELIMITER } = config;

export interface PlaceholderAnalysis {
    field: string;
    status: "present" | "absent" | "does_not_exist";
}

export interface AnalysisResult {
    placeholders: PlaceholderAnalysis[];
    summary: {
        present: number;
        absent: number;
        does_not_exist: number;
    };
}

/**
 * Recursively extracts all field names from a data structure
 * Preserves the .fields. notation to match template structure
 * Only extracts leaf fields (text, image) and collections, not intermediate object containers
 */
export function extractFieldNames(
    dataStructure: DataStructureSchema,
    prefix: string = ""
): string[] {
    const fields: string[] = [];

    for (const [key, value] of Object.entries(dataStructure)) {
        const fieldPath = prefix ? `${prefix}.${key}` : key;

        if (value.type === "object" && "fields" in value) {
            // Don't push the object itself, recurse into its fields with .fields. notation
            const fieldsPrefix = fieldPath + ".fields";
            fields.push(...extractFieldNames(value.fields, fieldsPrefix));
        } else if (value.type === "collection" && "items" in value && Array.isArray(value.items)) {
            fields.push(fieldPath);
            // For collections, analyze the item structure
            value.items.forEach((item: any) => {
                if (item.type === "object" && item.fields) {
                    // Collection items also use .fields. notation
                    const itemFieldsPrefix = fieldPath + ".fields";
                    fields.push(...extractFieldNames(item.fields, itemFieldsPrefix));
                }
            });
        } else {
            // Only push leaf fields (text, image, etc.)
            fields.push(fieldPath);
        }
    }

    return fields;
}

/**
 * Extracts placeholder names from template commands
 * Preserves the .fields. notation to match data structure
 * Also captures collection loop references and maps loop variables to their collections
 * Handles deeply nested loops by recursively resolving loop variables
 * Note: IF statements are ignored - they're just conditional logic, not field references
 */
export function extractPlaceholderNames(commands: any[]): string[] {
    const placeholders = new Set<string>();
    const loopVariables = new Map<string, string>(); // Map loop variable -> collection path

    // Helper function to resolve loop variables in a path
    const resolveLoopVariables = (path: string): string => {
        const parts = path.split(".");
        const firstPart = parts[0];

        if (loopVariables.has(firstPart)) {
            const resolvedBase = loopVariables.get(firstPart)!;
            const remainingPath = parts.slice(1).join(".");
            return remainingPath ? `${resolvedBase}.${remainingPath}` : resolvedBase;
        }
        return path;
    };

    for (const cmd of commands) {
        if (cmd.type === "FOR" || cmd.type === "FOR-EACH") {
            // Extract collection reference from FOR loops
            // e.g., "emp IN dept.fields.employees.items"
            const code = cmd.code.trim();
            const forMatch = code.match(/(\w+)\s+IN\s+([\w.]+)/i);
            if (forMatch) {
                const loopVar = forMatch[1];
                let collectionPath = forMatch[2].replace(/\.items$/, ""); // Remove .items suffix

                // Resolve any loop variables in the collection path
                collectionPath = resolveLoopVariables(collectionPath);

                placeholders.add(collectionPath);
                loopVariables.set(loopVar, collectionPath);
            }
        } else if (cmd.type === "INS" || cmd.type === "IMAGE") {
            // Extract variable name from code
            let code = cmd.code.trim();

            // Remove $ prefix (used in loops)
            code = code.replace(/^\$/, "");

            // Remove function calls like svgImgFile()
            const withoutFunctions = code.replace(/\([^)]*\)/g, "");

            // Extract base variable names (before array indices or method calls)
            const varMatch = withoutFunctions.match(/^[\w.]+/);
            if (varMatch) {
                let path = varMatch[0];

                // Resolve loop variables in the entire path
                path = resolveLoopVariables(path);

                placeholders.add(path);
            }
        }
        // IF statements are ignored - they only control visibility, not field presence
    }

    return Array.from(placeholders);
}


/**
 * Analyzes template placeholders against data structure
 * Returns categorized placeholders and summary statistics
 */
export async function analyzePlaceholders(
    template: ArrayBuffer,
    dataStructure: DataStructureSchema
): Promise<AnalysisResult> {
    // Extract commands from template and data structure fields
    const commands = await listCommands(template, TEMPLATE_CMD_DELIMITER);
    const templateFields = new Set(extractPlaceholderNames(commands));
    const dataStructureFields = extractFieldNames(dataStructure);

    // Initialize result containers
    const placeholders: PlaceholderAnalysis[] = [];
    const summary = { present: 0, absent: 0, does_not_exist: 0 };

    // Categorize data structure fields
    for (const field of dataStructureFields) {
        const status = templateFields.has(field) ? "present" : "absent";

        placeholders.push({ field, status });
        summary[status]++;
    }

    // Find template-only placeholders (don't exist in data structure)
    const dataStructureFieldsSet = new Set(dataStructureFields);
    for (const field of templateFields) {
        if (!dataStructureFieldsSet.has(field)) {
            placeholders.push({ field, status: "does_not_exist" });
            summary.does_not_exist++;
        }
    }

    return { placeholders, summary };
}
