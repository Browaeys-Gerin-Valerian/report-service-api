import path from "path";

interface IConfig {
    NODE_ENV: string,
    PORT: number,
    MONGO_URI: string,
    DB_NAME: string | undefined,
    ALLOWED_ORIGINS: string[],
    TEMPLATE_DIR: string,
    TEMPLATE_CMD_DELIMITER: string | [string, string] | undefined
}

export const config: IConfig = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017",
    DB_NAME: process.env.DB_NAME,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : ["http://localhost:3000"],
    TEMPLATE_DIR: path.join(process.cwd(), "templates_files"),
    TEMPLATE_CMD_DELIMITER: ['{', '}']
};