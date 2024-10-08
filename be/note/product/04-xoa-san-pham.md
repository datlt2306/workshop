# Chức năng cập nhật và xóa sản phẩm

## Bước 1: Tạo model sản phẩm

-   Dựa vào model product đã tạo ở bước [Chức năng lấy danh sách sản phẩm](./danh-sach-san-pham.md)

## Bước 2: Tạo controller cho sản phẩm

-   Trong file `controllers/product.js`, thêm hàm `deleteProduct` để xóa sản phẩm dựa trên ID:

```javascript
import Product from "../models/product";

// Xóa một sản phẩm theo ID
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID sản phẩm từ URL params
        const product = await Product.findByIdAndDelete(id); // Tìm và xóa sản phẩm theo ID
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm nào" }); // Trả về lỗi nếu không tìm thấy sản phẩm
        }
        res.status(200).json({ message: "Xóa sản phẩm thành công" }); // Trả về phản hồi thành công sau khi xóa
    } catch (error) {
        res.status(500).json({ message: error.message }); // Xử lý lỗi và trả về phản hồi lỗi
    }
};
```

## Bước 3: Tạo router cho sản phẩm

-   Mở file [routes/product.js](../../routes/product).
-   Thêm route cho chức năng thêm sản phẩm.

```javascript
import express from "express";
import { deleteProduct } from "../controllers/product";

const router = express.Router();

// Định nghĩa các route cho Product
router.delete("/products/:id", deleteProduct);

export default router;
```

## Bước 4: Nhúng router vào ứng dụng

-   Vì ở file `app.js` đã tự động load tất cả các router từ thư mục routes, nên không cần phải thêm router vào app.js.

## Bước 5: Kiểm tra chức năng

-   Chạy lệnh `npm run dev` để khởi động server.
-   Sử dụng `Postman` hoặc công cụ tương tự để gửi yêu cầu `DELETE` tới endpoint `/api/products/:id` để kiểm tra chức năng thêm sản phẩm.

### Ví dụ yêu cầu thêm sản phẩm

Gửi yêu cầu `DELETE` tới `http://localhost:3000/api/products/:id` với ID của sản phẩm cần lấy thông tin

Dữ liệu trả về sẽ có dạng:

```json
{
    "message": "Xóa sản phẩm thành công"
}
```
