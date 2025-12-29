
/**
 * Transforms data by recursively unwrapping:
 * - Collections from { items: [...] } to just [...]
 * - Objects from { fields: {...} } to just {...}
 * This is required for xlsx-template which expects flat data structures
 */
export function transformDataForXlsx(data: any): any {
    // Handle null/undefined
    if (data === null || data === undefined) {
        return data;
    }

    // Handle primitives (string, number, boolean)
    if (typeof data !== 'object') {
        return data;
    }

    // Handle arrays - recursively transform each item
    if (Array.isArray(data)) {
        return data.map(item => transformDataForXlsx(item));
    }

    // Handle objects
    // Check if this is a collection (has an "items" property that is an array)
    if ('items' in data && Array.isArray(data.items)) {
        // Unwrap the collection and recursively transform the items
        return data.items.map((item: any) => transformDataForXlsx(item));
    }

    // Check if this is an object wrapper (has a "fields" property that is an object)
    if ('fields' in data && typeof data.fields === 'object' && !Array.isArray(data.fields)) {
        // Unwrap the object and recursively transform the fields
        return transformDataForXlsx(data.fields);
    }

    // For regular objects, recursively transform each property
    const transformed: any = {};
    for (const [key, value] of Object.entries(data)) {
        transformed[key] = transformDataForXlsx(value);
    }

    return transformed;
}