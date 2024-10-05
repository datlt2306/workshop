# Chức năng thêm sản phẩm

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

## Bước 2: Tạo controller cho sản phẩm

-   Tạo file [controllers/product.js](../../controllers/product.js) và định nghĩa hàm thêm sản phẩm.

```javascript
import Product from "../models/product";

// Hàm để thêm một sản phẩm mới
export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        // Xử lý lỗi và trả về phản hồi lỗi với mã trạng thái 400
        res.status(400).json({ message: error.message });
    }
};
```

## Bước 3: Tạo router cho sản phẩm

-   Mở file [routes/product.js](../../routes/product).
-   Thêm route cho chức năng thêm sản phẩm.

```javascript
import express from "express";
import { createProduct } from "../controllers/product";

const router = express.Router();

// Định nghĩa các route cho Product
router.post("/products", createProduct);

export default router;
```

## Bước 4: Nhúng router vào ứng dụng

-   Vì ở file `app.js` đã tự động load tất cả các router từ thư mục routes, nên không cần phải thêm router vào app.js.

## Bước 5: Kiểm tra chức năng

-   Chạy lệnh `npm run dev` để khởi động server.
-   Sử dụng `Postman` hoặc công cụ tương tự để gửi yêu cầu `POST` tới endpoint `/api/products` để kiểm tra chức năng thêm sản phẩm.

### Ví dụ yêu cầu thêm sản phẩm

Gửi yêu cầu POST tới `http://localhost:3000/api/products` với dữ liệu JSON như sau:

```json
{
    "name": "Sản phẩm mới",
    "price": 100000,
    "image_url": "http://example.com/image.jpg",
    "attributes": ["attributeId1", "attributeId2"],
    "quantity": 10,
    "description": "Mô tả sản phẩm",
    "category": "categoryId",
    "tags": ["tag1", "tag2"],
    "sku": "SKU12345",
    "status": true
}
```
