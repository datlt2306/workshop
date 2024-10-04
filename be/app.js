import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";

// Lấy đường dẫn hiện tại và chuyển đổi thành đường dẫn thư mục
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(
    express.json({
        origin: "http://localhost:5173", // Thay bằng domain của client
        credentials: true, // Cho phép gửi cookie
    })
);
app.use(morgan("tiny")); // Sử dụng morgan để ghi lại các yêu cầu HTTP

// Tự động thêm tất cả các router từ thư mục routes
const routesPath = path.join(__dirname, "routes");
const loadRoutes = async () => {
    const files = fs.readdirSync(routesPath).filter((file) => file.endsWith(".js"));
    const importPromises = files.map((file) =>
        import(/* @vite-ignore */ path.join(routesPath, file)).then((module) => {
            app.use("/api", module.default);
        })
    );
    await Promise.all(importPromises);
};

loadRoutes().catch((error) => {
    console.error("Error loading routes:", error);
});

// Kết nối tới MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/workshop");

export const viteNodeApp = app;
