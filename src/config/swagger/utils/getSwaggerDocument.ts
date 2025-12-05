import fs from "fs"
import path from "path";

export async function getSwaggerDocument() {
    const swaggerUi = await import("swagger-ui-express")
    console.log(path.join(__dirname, "../openapi.json"))
    const swaggerDocument = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "../openapi.json"),
            "utf8"
        )
    );
    return { swaggerDocument, swaggerUi }
}
