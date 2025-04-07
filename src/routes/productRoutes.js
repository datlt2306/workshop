import express from "express";
import {
    getAllProducts,
    getProductById,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductVariants,
    getVariantById,
    createVariant,
    updateVariant,
    deleteVariant,
    setDefaultVariant,
    deleteProductImage,
} from "../controllers/productController";
import { verifyJWT, restrictTo } from "../middleware/auth";
import { createProductSchema, updateProductSchema } from "../validation/productValidation";
import { validateRequest } from "../middleware/validateRequest";
import { uploadFields } from "../middleware/uploadMiddleware";

const router = express.Router();

// Routes cho sản phẩm
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/slug/:slug", getProductBySlug);

// Routes yêu cầu xác thực
router.use(verifyJWT);

// Routes chỉ cho admin và staff
router.use(restrictTo("admin", "staff"));

// Cấu hình upload ảnh cho sản phẩm
const productImageUpload = uploadFields([
    { name: "thumbnailImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
]);

router.post("/", productImageUpload, validateRequest(createProductSchema), createProduct);
router.patch("/:id", productImageUpload, validateRequest(updateProductSchema), updateProduct);
router.delete("/:id", deleteProduct);

// Xóa ảnh sản phẩm
router.delete("/:productId/images/:imageIndex", deleteProductImage);

// Routes cho biến thể sản phẩm
router.get("/:productId/variants", getProductVariants);
router.get("/variants/:variantId", getVariantById);
router.post("/:productId/variants", createVariant);
router.patch("/variants/:variantId", updateVariant);
router.delete("/variants/:variantId", deleteVariant);
router.patch("/:productId/default-variant/:variantId", setDefaultVariant);

export default router;

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lấy tất cả sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng sản phẩm mỗi trang
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sắp xếp theo trường (prefix - để sắp xếp giảm dần)
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Chọn trường hiển thị (cách nhau bởi dấu phẩy)
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *     responses:
 *       200:
 *         description: Trả về danh sách sản phẩm
 *   post:
 *     summary: Tạo sản phẩm mới (Admin/Staff)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên sản phẩm
 *               description:
 *                 type: string
 *                 description: Mô tả sản phẩm
 *               price:
 *                 type: number
 *                 description: Giá sản phẩm
 *               compareAtPrice:
 *                 type: number
 *                 description: Giá so sánh (giá gốc trước khi giảm)
 *               costPrice:
 *                 type: number
 *                 description: Giá vốn
 *               category:
 *                 type: string
 *                 description: ID danh mục sản phẩm
 *               brand:
 *                 type: string
 *                 description: Thương hiệu
 *               countInStock:
 *                 type: integer
 *                 description: Số lượng tồn kho
 *               specs:
 *                 type: object
 *                 description: Thông số kỹ thuật của sản phẩm
 *               thumbnailImage:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh đại diện sản phẩm
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Các hình ảnh của sản phẩm
 *               isActive:
 *                 type: boolean
 *                 description: Trạng thái hoạt động
 *               isFeatured:
 *                 type: boolean
 *                 description: Sản phẩm nổi bật
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Các thẻ gắn với sản phẩm
 *     responses:
 *       201:
 *         description: Tạo sản phẩm thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *
 * /products/count:
 *   get:
 *     summary: Lấy tổng số lượng sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Lọc theo trạng thái hoạt động
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Lọc theo danh mục
 *     responses:
 *       200:
 *         description: Trả về tổng số lượng sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 count:
 *                   type: integer
 *                   example: 42
 *
 * /products/search:
 *   get:
 *     summary: Tìm kiếm sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Từ khóa tìm kiếm
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng sản phẩm mỗi trang
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: ID danh mục
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Giá tối thiểu
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Giá tối đa
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm sản phẩm
 *
 * /products/featured:
 *   get:
 *     summary: Lấy sản phẩm nổi bật
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng sản phẩm mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm nổi bật
 *
 * /products/category/{categoryId}:
 *   get:
 *     summary: Lấy sản phẩm theo danh mục
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng sản phẩm mỗi trang
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sắp xếp theo trường
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm trong danh mục
 *       404:
 *         description: Không tìm thấy danh mục
 *
 * /products/{id}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm
 *     responses:
 *       200:
 *         description: Chi tiết sản phẩm
 *       404:
 *         description: Không tìm thấy sản phẩm
 *   patch:
 *     summary: Cập nhật sản phẩm (Admin/Staff)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên sản phẩm
 *               description:
 *                 type: string
 *                 description: Mô tả sản phẩm
 *               price:
 *                 type: number
 *                 description: Giá sản phẩm
 *               compareAtPrice:
 *                 type: number
 *                 description: Giá so sánh (giá gốc trước khi giảm)
 *               costPrice:
 *                 type: number
 *                 description: Giá vốn
 *               category:
 *                 type: string
 *                 description: ID danh mục sản phẩm
 *               brand:
 *                 type: string
 *                 description: Thương hiệu
 *               countInStock:
 *                 type: integer
 *                 description: Số lượng tồn kho
 *               specs:
 *                 type: object
 *                 description: Thông số kỹ thuật của sản phẩm
 *               thumbnailImage:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh đại diện sản phẩm
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Các hình ảnh của sản phẩm
 *               isActive:
 *                 type: boolean
 *                 description: Trạng thái hoạt động
 *               isFeatured:
 *                 type: boolean
 *                 description: Sản phẩm nổi bật
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Các thẻ gắn với sản phẩm
 *     responses:
 *       200:
 *         description: Cập nhật sản phẩm thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy sản phẩm
 *   delete:
 *     summary: Xóa sản phẩm (Chỉ Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm
 *     responses:
 *       204:
 *         description: Xóa sản phẩm thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
