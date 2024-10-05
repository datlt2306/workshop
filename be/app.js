import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import morgan from "morgan";
import { fileURLToPath } from "url";

// Lấy đường dẫn hiện tại và chuyển đổi thành đường dẫn thư mục
const __filename = fileURLToPath(import.meta.url); // Lấy đường dẫn file hiện tại
const __dirname = path.dirname(__filename); // Lấy đường dẫn thư mục chứa file hiện tại
const app = express();

// Middleware
app.use(cors()); // Cho phép tất cả các nguồn gốc truy cập
app.use(express.json()); // Chuyển đổi body của request thành JSON
app.use(morgan("tiny")); // Ghi lại các yêu cầu HTTP

// Tự động thêm tất cả các router từ thư mục routes
const routesPath = path.join(__dirname, "routers"); // Đường dẫn tới thư mục routes
const loadRoutes = async () => {
    const files = fs.readdirSync(routesPath).filter((file) => file.endsWith(".js")); // Lấy tất cả các file .js trong thư mục routes
    const importPromises = files.map((file) =>
        import(/* @vite-ignore */ path.join(routesPath, file)).then((module) => {
            app.use("/api", module.default); // Thêm từng router vào ứng dụng
        })
    );
    await Promise.all(importPromises); // Đợi tất cả các router được thêm vào
};

loadRoutes().catch((error) => {
    console.error("Error loading routes:", error); // Xử lý lỗi nếu có
});

mongoose.connect("mongodb://127.0.0.1:27017/workshop");

export const viteNodeApp = app;
