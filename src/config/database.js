import mongoose from "mongoose";
import "../utils/mongoosePlugin"; // Import plugins trước khi kết nối

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            minPoolSize: 5,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 5000,
            heartbeatFrequencyMS: 10000,
            retryWrites: true,
            retryReads: true,
            w: "majority",
            wtimeoutMS: 2500,
        });

        if (process.env.NODE_ENV === "development") {
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        }

        // Xử lý các sự kiện kết nối
        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("MongoDB disconnected. Attempting to reconnect...");
        });

        mongoose.connection.on("reconnected", () => {
            console.info("MongoDB reconnected");
        });

        // Tối ưu hóa các truy vấn
        mongoose.set("debug", process.env.NODE_ENV === "development");
        mongoose.set("strictQuery", true);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

export { connectDB };
