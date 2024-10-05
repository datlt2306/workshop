# Chức năng thêm sản phẩm

## Bước 1: Tạo model sản phẩm

-   Dựa vào model product đã tạo ở bước [Chức năng lấy danh sách sản phẩm](./danh-sach-san-pham.md)

## Bước 2: Tạo controller cho sản phẩm

-   Tạo file [controllers/product.js](../../controllers/product.js) và định nghĩa hàm thêm sản phẩm.

```javascript
import Product from "../models/product";

// Hàm để thêm một sản phẩm mới
export const createProduct = async (req, res) => {
    try {
        const { name, productAttributes } = req.body;

        // Kiểm tra xem sản phẩm với tên này đã tồn tại chưa
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ message: "Sản phẩm với tên này đã tồn tại" });
        }

        // Tìm các thuộc tính sản phẩm dựa trên danh sách ID
        const attributes = await Attribute.find({ _id: { $in: productAttributes } });
        // Kiểm tra xem tất cả các thuộc tính có tồn tại không
        if (attributes.length !== productAttributes.length) {
            return res.status(400).json({ message: "Một hoặc nhiều thuộc tính không tìm thấy" });
        }

        // Tạo sản phẩm mới với dữ liệu từ request body
        const product = await Product.create(req.body);
        // Trả về phản hồi thành công với mã trạng thái 201 và dữ liệu sản phẩm mới
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
