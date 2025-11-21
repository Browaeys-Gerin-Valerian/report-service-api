export const config = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017",
    DB_NAME: process.env.DB_NAME,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : ["http://localhost:3000"],
};