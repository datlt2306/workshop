import express from "express";
import {
    getAllCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getRootCategories,
    getSubcategories,
    getCategoryTree,
} from "../controllers/categoryController";
import { verifyJWT, restrictTo } from "../middleware/auth";
import { validateRequest } from "../middleware/validateRequest";
import { categorySchema } from "../validation/categoryValidation"; // Assuming this exists

export const categoryRouter = express.Router();

// Public routes - accessible by anyone
categoryRouter.get("/", getAllCategories);
categoryRouter.get("/tree", getCategoryTree);
categoryRouter.get("/root", getRootCategories);
categoryRouter.get("/:id", getCategory);
categoryRouter.get("/:id/subcategories", getSubcategories);

// Protected routes - accessible only by authenticated users with proper roles
categoryRouter.use(verifyJWT);
categoryRouter.use(restrictTo("admin", "staff")); // Assuming these roles can manage categories

categoryRouter.post("/", validateRequest(categorySchema), createCategory);
categoryRouter.patch("/:id", validateRequest(categorySchema), updateCategory);
categoryRouter.delete("/:id", deleteCategory);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lấy danh sách tất cả danh mục
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng item mỗi trang
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sắp xếp (ví dụ "name,-createdAt")
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Giới hạn trường (ví dụ "name,slug,image")
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 *   post:
 *     summary: Tạo danh mục mới
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               parent:
 *                 type: string
 *                 format: uuid
 *                 description: ID của danh mục cha
 *               image:
 *                 type: string
 *                 description: URL hình ảnh
 *               isFeatured:
 *                 type: boolean
 *               order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Đã tạo danh mục thành công
 *       401:
 *         description: Không có quyền truy cập
 *
 * /categories/tree:
 *   get:
 *     summary: Lấy cấu trúc danh mục dạng cây
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Cấu trúc cây danh mục
 *
 * /categories/root:
 *   get:
 *     summary: Lấy danh sách danh mục gốc (không có danh mục cha)
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Danh sách danh mục gốc
 *
 * /categories/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của danh mục
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục
 *     responses:
 *       200:
 *         description: Thông tin chi tiết danh mục
 *       404:
 *         description: Không tìm thấy danh mục
 *   patch:
 *     summary: Cập nhật thông tin danh mục
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               parent:
 *                 type: string
 *                 format: uuid
 *                 description: ID của danh mục cha
 *               image:
 *                 type: string
 *                 description: URL hình ảnh
 *               isFeatured:
 *                 type: boolean
 *               order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Đã cập nhật danh mục thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy danh mục
 *   delete:
 *     summary: Xóa danh mục
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục
 *     responses:
 *       204:
 *         description: Đã xóa danh mục thành công
 *       400:
 *         description: Không thể xóa danh mục có danh mục con
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy danh mục
 *
 * /categories/{id}/subcategories:
 *   get:
 *     summary: Lấy danh sách danh mục con của một danh mục
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục cha
 *     responses:
 *       200:
 *         description: Danh sách danh mục con
 */
