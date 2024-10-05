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
npm install express
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

Tạo file app.js và thêm code sau để thiết lập server Express:

```javascript
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
app.use(express.json());
// Sử dụng morgan để ghi lại các yêu cầu HTTP
app.use(morgan("tiny"));
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
