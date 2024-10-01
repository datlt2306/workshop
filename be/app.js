import express from "express";
import cors from "cors";

const products = [
    {
        key: "1",
        name: "Product 1",
        price: 10.0,
        in_stock: true,
        image: "image1.jpg",
        description: "Description for product 1",
    },
    {
        key: "2",
        name: "Product 2",
        price: 20.0,
        in_stock: false,
        image: "image2.jpg",
        description: "Description for product 2",
    },
    {
        key: "3",
        name: "Product 3",
        price: 30.0,
        in_stock: true,
        image: "image3.jpg",
        description: "Description for product 3",
    },
    {
        key: "4",
        name: "Product 4",
        price: 40.0,
        in_stock: true,
        image: "image4.jpg",
        description: "Description for product 4",
    },
    {
        key: "5",
        name: "Product 5",
        price: 50.0,
        in_stock: false,
        image: "image5.jpg",
        description: "Description for product 5",
    },
    {
        key: "6",
        name: "Product 6",
        price: 60.0,
        in_stock: true,
        image: "image6.jpg",
        description: "Description for product 6",
    },
    {
        key: "7",
        name: "Product 7",
        price: 70.0,
        in_stock: true,
        image: "image7.jpg",
        description: "Description for product 7",
    },
    {
        key: "8",
        name: "Product 8",
        price: 80.0,
        in_stock: false,
        image: "image8.jpg",
        description: "Description for product 8",
    },
    {
        key: "9",
        name: "Product 9",
        price: 90.0,
        in_stock: true,
        image: "image9.jpg",
        description: "Description for product 9",
    },
    {
        key: "10",
        name: "Product 10",
        price: 100.0,
        in_stock: true,
        image: "image10.jpg",
        description: "Description for product 10",
    },
];

const app = express();

app.use(cors());

app.get("/api/products", (req, res) => {
    res.json(products);
});

export const viteNodeApp = app;

/**
 * B1: npm init -y
 * B2: npm i vite vite-plugin-node -D
 * B3: npm i express
 * B4: Tạo và truy cập file vite.config.js, chỉnh sửa appPath: "./app.js",
 * B5: Tạo file app.js, thêm code trên
 * B6: Truy cập package.json, thêm script "dev": "vite"
 * B7: Chạy npm run dev
 */

/**
 * B1: Tạo danh sách sản phẩm
 * B2: Trả về danh sách sản phẩm khi truy cập /api/products
 * B3: cài đặt middleware cors: npm i cors
 * B4: Thêm middleware cors vào app: app.use(cors())
 * B5: Truy cập file danh sách sản phẩm ở front end, chỉnh sửa lại đường dẫn API
 */
