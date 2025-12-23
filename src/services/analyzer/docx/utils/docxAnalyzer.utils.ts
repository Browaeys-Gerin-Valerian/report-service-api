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
    // Step 1: Initialize array to collect all field paths
    const fields: string[] = [];

    // Step 2: Iterate through each field in the data structure
    for (const [key, value] of Object.entries(dataStructure)) {
        // Step 3: Build the full field path (with prefix if nested)
        const fieldPath = prefix ? `${prefix}.${key}` : key;

        // Step 4: Handle object types - recurse into nested fields
        if (value.type === "object" && "fields" in value) {
            // Step 4a: Don't push the object itself, recurse into its fields with .fields. notation
            const fieldsPrefix = fieldPath + ".fields";
            // Step 4b: Recursively extract fields from nested object
            fields.push(...extractFieldNames(value.fields, fieldsPrefix));
        }
        // Step 5: Handle collection types
        else if (value.type === "collection" && "items" in value && Array.isArray(value.items)) {
            // Step 5a: Add the collection field itself
            fields.push(fieldPath);
            // Step 5b: Analyze the item structure within the collection
            value.items.forEach((item: any) => {
                // Step 5c: If collection contains objects, recurse into their fields
                if (item.type === "object" && item.fields) {
                    // Collection items also use .fields. notation
                    const itemFieldsPrefix = fieldPath + ".fields";
                    // Step 5d: Recursively extract fields from collection items
                    fields.push(...extractFieldNames(item.fields, itemFieldsPrefix));
                }
            });
        }
        // Step 6: Handle leaf fields (text, image, etc.)
        else {
            // Only push leaf fields (text, image, etc.)
            fields.push(fieldPath);
        }
    }

    // Step 7: Return all collected field paths
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
    // Step 1: Initialize Set to collect unique placeholder field paths
    const placeholders = new Set<string>();

    // Step 2: Initialize Map to track loop variables and their associated collection paths
    // This allows us to resolve loop variables (e.g., $image.id -> example_4)
    const loopVariables = new Map<string, string>(); // Map loop variable -> collection path

    // Step 3: Define helper function to recursively resolve loop variables in field paths
    const resolveLoopVariables = (path: string): string => {
        // Step 3a: Split path into parts (e.g., "image.filename" -> ["image", "filename"])
        const parts = path.split(".");
        const firstPart = parts[0];

        // Step 3b: Check if the first part is a loop variable
        if (loopVariables.has(firstPart)) {
            // Step 3c: Get the actual collection path for this loop variable
            const resolvedBase = loopVariables.get(firstPart)!;
            // Step 3d: Get remaining path parts after the loop variable
            const remainingPath = parts.slice(1).join(".");
            // Step 3e: Combine resolved base with remaining path
            const combined = remainingPath ? `${resolvedBase}.${remainingPath}` : resolvedBase;
            // Step 3f: RECURSIVELY resolve in case resolvedBase contains loop variables
            // This handles deeply nested loops (e.g., dept.fields.emp -> departments.fields.employees)
            return resolveLoopVariables(combined);
        }
        // Step 3g: Return original path if not a loop variable
        return path;
    };

    // Step 4: Iterate through all template commands
    for (const cmd of commands) {
        // Step 5: Handle FOR/FOR-EACH loops
        if (cmd.type === "FOR" || cmd.type === "FOR-EACH") {
            // Step 5a: Get the command code (e.g., "image IN example_4.items")
            const code = cmd.code.trim();
            // Step 5b: Extract loop variable and collection path using regex
            const forMatch = code.match(/(\w+)\s+IN\s+([\w.]+)/i);
            if (forMatch) {
                // Step 5c: Extract loop variable name (e.g., "image")
                const loopVar = forMatch[1];
                // Step 5d: Extract collection path and remove .items suffix
                let collectionPath = forMatch[2].replace(/\.items$/, "");

                // Step 5e: Resolve any nested loop variables in the collection path
                collectionPath = resolveLoopVariables(collectionPath);

                // Step 5f: Add collection path to placeholders
                placeholders.add(collectionPath);
                // Step 5g: Store mapping of loop variable to collection path for later resolution
                loopVariables.set(loopVar, collectionPath);
            }
        }
        // Step 6: Handle INS (insert) and IMAGE commands
        else if (cmd.type === "INS" || cmd.type === "IMAGE") {
            // Step 6a: Get the command code and clean it
            let code = cmd.code.trim();

            // Step 6b: Remove $ prefix (used in loop variable references like $image.id)
            code = code.replace(/^\$/, "");

            // Step 7: Handle IMAGE commands specially
            if (cmd.type === "IMAGE") {
                // Step 7a: Extract second parameter (field path) from injectImg('id', 'field.path')
                const functionMatch = code.match(/\w+\s*\(\s*[^,]+,\s*['"]([^'"]+)['"]/);
                if (functionMatch) {
                    // Step 7b: Get the field path from the match
                    let fieldPath = functionMatch[1];

                    // Step 7c: Resolve any loop variables in the field path
                    fieldPath = resolveLoopVariables(fieldPath);

                    // Step 7d: Add resolved field path to placeholders
                    placeholders.add(fieldPath);
                }
            }
            // Step 8: Handle INS (text insertion) commands
            else {
                // Step 8a: Remove function calls from code (e.g., svgImgFile())
                const withoutFunctions = code.replace(/\([^)]*\)/g, "");

                // Step 8b: Extract base variable name (before array indices or method calls)
                const varMatch = withoutFunctions.match(/^[\w.]+/);
                if (varMatch) {
                    // Step 8c: Get the matched path
                    let path = varMatch[0];

                    // Step 8d: Resolve any loop variables in the path
                    path = resolveLoopVariables(path);

                    // Step 8e: Add resolved path to placeholders
                    placeholders.add(path);
                }
            }
        }
        // Step 9: IF statements are ignored - they only control visibility, not field presence
    }

    // Step 10: Convert Set to Array and return all unique placeholder paths
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
    // Step 1: Extract commands from the template using docx-templates
    const commands = await listCommands(template, TEMPLATE_CMD_DELIMITER);

    // Step 2: Extract placeholder field paths from template commands
    const templateFields = new Set(extractPlaceholderNames(commands));

    // Step 3: Extract field paths from the data structure schema
    const dataStructureFields = extractFieldNames(dataStructure);

    // Step 4: Initialize result containers for analysis output
    const placeholders: PlaceholderAnalysis[] = [];
    const summary = { present: 0, absent: 0, does_not_exist: 0 };

    // Step 5: Categorize each data structure field based on template presence
    for (const field of dataStructureFields) {
        // Step 5a: Check if the field exists in the template
        const status = templateFields.has(field) ? "present" : "absent";

        // Step 5b: Add field analysis to results
        placeholders.push({ field, status });

        // Step 5c: Update summary count for this status
        summary[status]++;
    }

    // Step 6: Find template placeholders that don't exist in data structure
    const dataStructureFieldsSet = new Set(dataStructureFields);
    for (const field of templateFields) {
        // Step 6a: Check if template field exists in data structure
        if (!dataStructureFieldsSet.has(field)) {
            // Step 6b: Mark as "does_not_exist" - template has field but data structure doesn't
            placeholders.push({ field, status: "does_not_exist" });

            // Step 6c: Update summary count for missing fields
            summary.does_not_exist++;
        }
    }

    return { placeholders, summary };
}
