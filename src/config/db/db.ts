import mongoose from "mongoose";
import { config } from "..";
const { MONGO_URI, NODE_ENV, DB_NAME } = config;

export async function connectDb(): Promise<typeof mongoose> {
    const opts = {
        autoIndex: NODE_ENV !== "production",
    };
    try {
        await mongoose.connect(`${MONGO_URI}/${DB_NAME}`, opts);
        console.log("✅ MongoDB connected");
        return mongoose;
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    }
}
