export function parsedBody(rawBody: any): Record<string, any> {

    const parsedBody: Record<string, any> = {};
    for (const key of Object.keys(rawBody)) {
        const value = rawBody[key];

        if (typeof value === "string") {
            try {
                parsedBody[key] = JSON.parse(value);
            } catch {
                parsedBody[key] = value;
            }
        } else {
            parsedBody[key] = value;
        }
    }
    return parsedBody;
}