import "dotenv/config";
import { createApp } from "./app";
import { connectDb } from "./config/db/db";
import { config } from "./config";
const { PORT } = config;

async function main() {
    await connectDb();
    const app = createApp();
    const server = app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
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
