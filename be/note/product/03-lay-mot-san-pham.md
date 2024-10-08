# Chức năng lấy thông tin một sản phẩm

## Bước 1: Tạo model sản phẩm

-   Dựa vào model product đã tạo ở bước [Chức năng lấy danh sách sản phẩm](./danh-sach-san-pham.md)

## Bước 2: Tạo controller cho sản phẩm

-   Mở file [controllers/product.js](../../controllers/product.js).
-   Sửa hàm `getProductById` để hỗ trợ populate các trường liên quan.
-   Sử dụng `/products/1` để lấy thông tin sản phẩm.
-   Sử dụng `/products/1?_embed=category` để lấy thông tin sản phẩm với thông tin danh mục.

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

# Sử dụng mongoose-paginate-v2

Mục tiêu: Sử dụng mongoose-paginate-v2 để hỗ trợ phân trang khi lấy danh sách sản phẩm.

## Lấy danh sách sản phẩm với phân trang

### Bước 1: Cài đặt mongoose-paginate-v2

-   Chạy lệnh sau để cài đặt mongoose-paginate-v2:

```bash
npm install mongoose-paginate-v2
```

### Bước 2: import mongoosePaginate vào model sản phẩm

-   Mở file [models/product.js](../../models/product.js).
-   Import mongoosePaginate vào model sản phẩm.

```javascript
import mongoosePaginate from "mongoose-paginate-v2";

const ProductSchema = new mongoose.Schema(
    {
        // ...
    },
    { timestamps: true, versionKey: false }
);
// Thêm plugin mongoose-paginate-v2 để hỗ trợ phân trang
ProductSchema.plugin(mongoosePaginate);
```

### Bước 3: Sử dụng paginate() trong controller lấy danh sách sản phẩm

-   Mong muốn `/products?page=1&limit=10` để lấy 10 sản phẩm đầu tiên.
-   Sử dụng `paginate()` để lấy danh sách sản phẩm với phân trang.
-   Mong muốn `/products?_embed=category`để lấy danh sách sản phẩm với thông tin danh mục.

```javascript
export const getProducts = async (req, res) => {
    try {
        const { _page = 1, _limit = 10, _embed } = req.query;
        const options = {
            page: parseInt(_page, 10),
            limit: parseInt(_limit, 10),
        };

        let query = Product.find();

        if (_embed) {
            const embeds = _embed.split(",");
            embeds.forEach((embed) => {
                query = query.populate(embed);
            });
        }

        const result = await Product.paginate(query, options);
        const { docs, ...paginationData } = result; // Loại bỏ trường docs

        return res.status(200).json({
            products: docs,
            ...paginationData,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
```

### Bước 4: Kiểm tra chức năng

-   Chạy lệnh `npm run dev` để khởi động server.
-   Sử dụng Postman hoặc công cụ tương tự để gửi yêu cầu `GET` tới endpoint `/api/products/:id` để kiểm tra chức năng lấy danh sách sản phẩm với phân trang.

### Ví dụ yêu cầu lấy danh sách sản phẩm

Gửi yêu cầu GET tới `http://localhost:3000/api/products/6700ad3107905e1c68bb1a5d`.

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
    ],
    "totalDocs": 1,
    "limit": 10,
    "totalPages": 1,
    "page": 1,
    "pagingCounter": 1,
    "hasPrevPage": false,
    "hasNextPage": false,
    "prevPage": null,
    "nextPage": null
}
```
