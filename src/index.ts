import "tsconfig-paths/register";
import "dotenv/config";
import { createApp } from "./app";
import { connectDb } from "@config/db/db.connect";
import { config } from "@config/index";
const { PORT, NODE_ENV } = config;

async function main() {
    await connectDb();
    const app = await createApp();
    const server = app.listen(PORT, () => {
        console.log(`🚀 Server listening on port ${PORT}`);
        if (NODE_ENV !== "production") console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`)
    });

    process.on("SIGINT", () => {
        console.log("SIGINT received");
        server.close(() => process.exit(0));
    });
}

main().catch(err => {
    console.error("Fatal error during startup:", err);
    process.exit(1);
});
