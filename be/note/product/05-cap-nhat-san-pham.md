# Chức năng cập nhật và xóa sản phẩm

## Bước 1: Tạo model sản phẩm

-   Dựa vào model product đã tạo ở bước [Chức năng lấy danh sách sản phẩm](./danh-sach-san-pham.md)

## Bước 2: Tạo controller cho sản phẩm

-   Trong file `controllers/product.js`, thêm hàm `updateProduct` để cập nhật thông tin một sản phẩm dựa trên ID và `deleteProduct` để xóa sản phẩm dựa trên ID:

```javascript
import Product from "../models/product";

// Cập nhật một sản phẩm theo ID
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID sản phẩm từ URL params
        const product = await Product.findByIdAndUpdate(id, req.body, {
            new: true, // Trả về sản phẩm mới sau khi cập nhật
            runValidators: true, // Chạy các validator đã định nghĩa trong schema
        });
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm nào" }); // Trả về lỗi nếu không tìm thấy sản phẩm
        }
        res.status(200).json(product); // Trả về thông tin sản phẩm sau khi cập nhật
    } catch (error) {
        res.status(400).json({ message: error.message }); // Xử lý lỗi và trả về phản hồi lỗi
    }
};
```

## Bước 3: Tạo router cho sản phẩm

-   Mở file [routes/product.js](../../routes/product).
-   Thêm route cho chức năng thêm sản phẩm.

```javascript
import express from "express";
import { updateProduct, deleteProduct } from "../controllers/product";

const router = express.Router();

// Định nghĩa các route cho Product
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
```

## Bước 4: Nhúng router vào ứng dụng

-   Vì ở file `app.js` đã tự động load tất cả các router từ thư mục routes, nên không cần phải thêm router vào app.js.

## Bước 5: Kiểm tra chức năng

-   Chạy lệnh `npm run dev` để khởi động server.
-   Sử dụng `Postman` hoặc công cụ tương tự để gửi yêu cầu POST tới endpoint `/api/products/:id` để kiểm tra chức năng thêm sản phẩm.

### Ví dụ yêu cầu thêm sản phẩm

Gửi yêu cầu `PUT` tới `http://localhost:3000/api/products/:id` và cung cấp dữ liệu JSON cần cập nhật.

```json
{
    "name": "Product Name",
    "price": 100,
    "description": "Product Description"
}
```

Dữ liệu trả về sẽ có dạng:

```json
{
    "name": "Product Name updated",
    "price": 100,
    "description": "Product Description"
}
```
