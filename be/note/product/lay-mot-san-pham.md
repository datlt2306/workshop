# Chức năng lấy thông tin một sản phẩm

## Bước 1: Tạo model sản phẩm

-   Dựa vào model product đã tạo ở bước [Chức năng lấy danh sách sản phẩm](./danh-sach-san-pham.md)

## Bước 2: Tạo controller cho sản phẩm

-   Trong file `controllers/product.js`, thêm hàm `getProductById` để lấy thông tin một sản phẩm dựa trên ID:

```javascript
// Hàm để lấy thông tin chi tiết của một sản phẩm theo ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID sản phẩm từ URL params
        const { _embed } = req.query; // Lấy thông tin các trường cần populate từ query params
        let query = Product.findById(id); // Tạo query để tìm sản phẩm theo ID

        // Nếu có yêu cầu populate các trường liên quan
        if (_embed) {
            const embeds = _embed.split(","); // Tách các trường cần populate thành mảng
            embeds.forEach((embed) => {
                query = query.populate(embed); // Thêm các trường cần populate vào query
            });
        }

        const product = await query.exec(); // Thực thi query để lấy thông tin sản phẩm
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" }); // Trả về lỗi nếu không tìm thấy sản phẩm
        }
        res.status(200).json(product); // Trả về thông tin sản phẩm nếu tìm thấy
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
import { getProductById } from "../controllers/product";

const router = express.Router();

// Định nghĩa các route cho Product
router.get("/products/:id", getProductById);

export default router;
```

## Bước 4: Nhúng router vào ứng dụng

-   Vì ở file `app.js` đã tự động load tất cả các router từ thư mục routes, nên không cần phải thêm router vào app.js.

## Bước 5: Kiểm tra chức năng

-   Chạy lệnh `npm run dev` để khởi động server.
-   Sử dụng `Postman` hoặc công cụ tương tự để gửi yêu cầu `GET` tới endpoint `/api/products/:id` để kiểm tra chức năng thêm sản phẩm.

### Ví dụ yêu cầu thêm sản phẩm

Gửi yêu cầu GET tới `http://localhost:3000/api/products/:id` với ID của sản phẩm cần lấy thông tin

Dữ liệu trả về sẽ có dạng:

```json
{
    "attributes": [],
    "quantity": 1,
    "reviews": 0,
    "tags": [],
    "status": true,
    "_id": "66ff3f98cc8ced208a55691f",
    "product_name": "Sản phẩm 4",
    "product_price": 500,
    "product_image_url": "sofa.png",
    "product_attributes": ["66fe52386a54882b1425976a"],
    "product_quantity": 10,
    "product_description": "A comfortable sofa",
    "product_rating": 4.5,
    "product_reviews": 10,
    "product_category": "66ff3a87106e8b32a419fdfb",
    "product_tags": ["sofa", "furniture"],
    "product_sku": "SOFA123",
    "product_status": true,
    "createdAt": "2024-10-04T01:06:32.608Z",
    "updatedAt": "2024-10-04T01:06:32.608Z",
    "slug": "san-pham-4"
}
```
