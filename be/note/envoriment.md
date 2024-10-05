# Cài đặt môi trường với Vite và vite-plugin-node

## Bước 1: Khởi tạo dự án Node.js

Chạy lệnh sau để khởi tạo một dự án Node.js mới:

```sh
npm init -y
```

## Bước 2: Cài đặt Vite và vite-plugin-node

Cài đặt Vite và vite-plugin-node dưới dạng devDependencies:

```bash
npm install vite vite-plugin-node --save-dev
```

## Bước 3: Cài đặt Express

Cài đặt Express để xây dựng server:

```bash
npm install express mongoose cors morgan --save
```

## Bước 4: Cấu hình Vite

Tạo file vite.config.js và thêm cấu hình sau:

```javascript
import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";

export default defineConfig({
    server: {
        port: 3000,
    },
    plugins: [
        ...VitePluginNode({
            adapter: "express",
            appPath: "./app.js",
            exportName: "viteNodeApp",
        }),
    ],
});
```

## Bước 5: Tạo file app.js

Tạo file `app.js` và thêm code sau để thiết lập server Express:

```javascript
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";

// Lấy đường dẫn hiện tại và chuyển đổi thành đường dẫn thư mục
const __filename = fileURLToPath(import.meta.url); // Lấy đường dẫn file hiện tại
const __dirname = path.dirname(__filename); // Lấy đường dẫn thư mục chứa file hiện tại

const app = express();

// Middleware
app.use(cors()); // Cho phép tất cả các nguồn gốc truy cập
app.use(express.json()); // Chuyển đổi body của request thành JSON
app.use(morgan("tiny")); // Ghi lại các yêu cầu HTTP

// Tự động thêm tất cả các router từ thư mục routes
const routesPath = path.join(__dirname, "routes"); // Đường dẫn tới thư mục routes
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

// Kết nối tới MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/workshop");

export const viteNodeApp = app;
```

## Bước 6: Cấu hình script trong package.json

Mở file package.json và thêm script để chạy server:

```json
{
    "scripts": {
        "dev": "nodemon --watch './**/*.js' --exec vite"
    }
}
```

## Bước 7: Chạy server

Chạy lệnh sau để khởi động server:

```bash
npm run dev
```

## Bước 8: Kiểm tra server

Mở trình duyệt và truy cập http://localhost:3000 để kiểm tra server đã hoạt động.
