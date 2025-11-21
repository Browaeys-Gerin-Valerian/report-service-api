import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { config } from "./config";
import { router } from "./routes/index.routes";
const { NODE_ENV, ALLOWED_ORIGINS } = config;

export function createApp() {
    const app = express();
    app.use(helmet());
    app.use(cors({ origin: ALLOWED_ORIGINS, methods: ["GET", "PUT", "PATCH", "POST", "DELETE"] }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
    app.use("/api", router);
    return app;
}
