import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { config } from "@config/index";
import { router } from "@router/index.routes";
import { getSwaggerDocument } from "@config/swagger/utils/getSwaggerDocument";
const { NODE_ENV, ALLOWED_ORIGINS } = config;



export async function createApp() {
    const app = express();
    app.use(helmet());
    app.use(cors({ origin: ALLOWED_ORIGINS, methods: ["GET", "PUT", "PATCH", "POST", "DELETE"] }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
    app.use("/api", router);

    //SWAGGER ONLY IN DEV
    if (NODE_ENV !== "production") {
        const { swaggerUi, swaggerDocument } = await getSwaggerDocument()
        app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }
    return app;
}
