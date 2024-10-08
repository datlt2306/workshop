# Chức năng lấy danh sách sản phẩm

Mục tiêu: Tạo chức năng lấy danh sách sản phẩm cơ bản sử dụng .find() của Mongoose.

## Bước 1: Tạo model sản phẩm

-   Tạo file [models/product.js](../../models/product.js) và định nghĩa schema sản phẩm.

```javascript
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            unique: true,
        },
        slug: {
            type: String,
            unique: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image_url: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            default: 1,
        },
        description: {
            type: String,
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
        },
        reviews: {
            type: Number,
            default: 0,
        },
        tags: [String],
        sku: {
            type: String,
            required: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model("Product", ProductSchema);
```

## Bước 3: Tạo controller lấy danh sách sản phẩm

Tạo file [controllers/product.js](../../controllers/product.js) và định nghĩa hàm lấy danh sách sản phẩm.

```javascript
import Product from "../models/product";

// Lấy danh sách sản phẩm với phân trang
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
```

## Bước 4: Tạo route lấy danh sách sản phẩm

-   Mở file [routes/product.js](../../routes/product.js).

```javascript
import express from "express";
import { getProducts, createProduct } from "../controllers/product";

const router = express.Router();

// Route để lấy danh sách sản phẩm
router.get("/products", getProducts);
// Route để thêm một sản phẩm mới
router.post("/products", createProduct);

export default router;
```

## Bước 5: Nhúng router vào ứng dụng

-   Mở file [app.js](../../app.js).
-   Nhúng router sản phẩm vào ứng dụng.

```javascript
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import productRouter from "./routes/product";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

// Nhúng router sản phẩm vào ứng dụng
app.use("/api", productRouter);
// Kết nối tới MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/workshop");

export const viteNodeApp = app;
```

## Bước 6: Kiểm tra chức năng

-   Chạy lệnh `npm run dev` để khởi động server.
-   Sử dụng Postman hoặc công cụ tương tự để gửi yêu cầu `GET` tới endpoint `/api/products` để kiểm tra chức năng lấy danh sách sản phẩm với phân trang.

### Ví dụ yêu cầu lấy danh sách sản phẩm

Gửi yêu cầu GET tới `http://localhost:3000/api/products?page=1&limit=10`.

**Dữ liệu trả về**

```json
{
    "products": [
        {
            "_id": "6700ad3107905e1c68bb1a5d",
            "name": "Sản phẩm mới 1",
            "price": 100,
            "image_url": "https://example.com/image.jpg",
            "quantity": 10,
            "description": "Mô tả sản phẩm",
            "rating": 4.5,
            "reviews": 10,
            "tags": ["tag1", "tag2"],
            "sku": "SKU001",
            "status": true,
            "createdAt": "2024-10-05T03:06:25.694Z",
            "updatedAt": "2024-10-05T03:06:25.694Z",
            "slug": "san-pham-moi-1"
        }
    ]
}
```
