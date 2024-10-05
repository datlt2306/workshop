# Chức năng lấy danh sách sản phẩm

## Bước 1: Tạo model sản phẩm

-   Tạo file [models/product.js](be/models/product.js) và định nghĩa schema sản phẩm.

```javascript
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import slugify from "slugify";

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
        attributes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Attribute",
                required: true,
            },
        ],
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
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
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

// Middleware để tự động tạo slug từ tên sản phẩm
ProductSchema.pre("save", function (next) {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

// Thêm plugin mongoose-paginate-v2 để hỗ trợ phân trang
ProductSchema.plugin(mongoosePaginate);

export default mongoose.model("Product", ProductSchema);
```

## Bước 2: Cài đặt mongoose-paginate-v2

-   Chạy lệnh sau để cài đặt mongoose-paginate-v2:

```bash
npm install mongoose-paginate-v2
```

## Bước 3: Tạo controller lấy danh sách sản phẩm

Tạo file controllers/product.js và định nghĩa hàm lấy danh sách sản phẩm.

```javascript
import Product from "../models/product";

// Lấy danh sách sản phẩm với phân trang
export const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
        };
        const products = await Product.paginate({}, options);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
```

## Bước 4: Tạo route lấy danh sách sản phẩm

-   Mở file [routes/product.js](be/routes/product.js).

```javascript
import express from "express";
import { getProducts } from "../controllers/product";

const router = express.Router();

// Định nghĩa các route cho Product
router.get("/products", getProducts);

export default router;
```

## Bước 5: Kiểm tra chức năng

-   Chạy lệnh `npm run dev` để khởi động server.
-   Sử dụng Postman hoặc công cụ tương tự để gửi yêu cầu GET tới endpoint `/api/products` để kiểm tra chức năng lấy danh sách sản phẩm với phân trang.

### Ví dụ yêu cầu lấy danh sách sản phẩm

Gửi yêu cầu GET tới `http://localhost:3000/api/products?page=1&limit=10`.
