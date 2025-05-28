import dotenv from "dotenv";
dotenv.config();

import { app } from "./app";

const PORT = process.env.PORT || 4000;

// Xử lý lỗi không đồng bộ
process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.error(err.name, err.message);
    process.exit(1);
});

const server = app.listen(PORT, () => {
    if (process.env.NODE_ENV === "development") {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    }
});

// Xử lý lỗi promise bị từ chối
process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION! 💥 Shutting down...");
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
