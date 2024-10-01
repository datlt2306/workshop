import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});

export const viteNodeApp = app;

/**
 * B1: npm i vite vite-plugin-node -D
 * B2: npm i express
 * B3: Tạo và truy cập file vite.config.js, chỉnh sửa appPath: "./app.js",
 * B4: Tạo file app.js, thêm code trên
 * B5: Truy cập package.json, thêm script "dev": "vite"
 * B6: Chạy npm run dev
 */
