import express from "express"
import {
  getAllAttributes,
  getAttribute,
  createAttribute,
  updateAttribute,
  deleteAttribute,
  addAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
} from "../controllers/attributeController"
import { verifyJWT, restrictTo } from "../middleware/auth"
import { validateRequest } from "../middleware/validateRequest"
import { attributeSchema, attributeValueSchema } from "../validation/attributeValidation"

export const attributeRouter = express.Router()

// Public routes
attributeRouter.get("/", getAllAttributes)
attributeRouter.get("/:id", getAttribute)

// Protected routes - admin and staff only
attributeRouter.use(verifyJWT)
attributeRouter.use(restrictTo("admin", "staff"))

attributeRouter.post("/", validateRequest(attributeSchema), createAttribute)
attributeRouter.patch("/:id", validateRequest(attributeSchema), updateAttribute)
attributeRouter.delete("/:id", deleteAttribute)

// Attribute values routes
attributeRouter.post("/:id/values", validateRequest(attributeValueSchema), addAttributeValue)
attributeRouter.patch("/:id/values/:valueId", validateRequest(attributeValueSchema), updateAttributeValue)
attributeRouter.delete("/:id/values/:valueId", deleteAttributeValue)

/**
 * @swagger
 * /attributes:
 *   get:
 *     summary: Lấy danh sách tất cả thuộc tính sản phẩm
 *     tags: [Attributes]
 *     responses:
 *       200:
 *         description: Danh sách thuộc tính
 *   post:
 *     summary: Tạo thuộc tính mới (admin, staff)
 *     tags: [Attributes]
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
 *               displayName:
 *                 type: string
 *               description:
 *                 type: string
 *               filterType:
 *                 type: string
 *                 enum: [checkbox, radio, color, button]
 *     responses:
 *       201:
 *         description: Tạo thuộc tính thành công
 *       401:
 *         description: Không có quyền truy cập
 *
 * /attributes/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết thuộc tính
 *     tags: [Attributes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thuộc tính
 *     responses:
 *       200:
 *         description: Thông tin chi tiết thuộc tính
 *       404:
 *         description: Không tìm thấy thuộc tính
 *   patch:
 *     summary: Cập nhật thuộc tính (admin, staff)
 *     tags: [Attributes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thuộc tính
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               displayName:
 *                 type: string
 *               description:
 *                 type: string
 *               filterType:
 *                 type: string
 *                 enum: [checkbox, radio, color, button]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy thuộc tính
 *   delete:
 *     summary: Xóa thuộc tính (admin, staff)
 *     tags: [Attributes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thuộc tính
 *     responses:
 *       204:
 *         description: Xóa thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy thuộc tính
 *
 * /attributes/{id}/values:
 *   post:
 *     summary: Thêm giá trị mới cho thuộc tính (admin, staff)
 *     tags: [Attributes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thuộc tính
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *             properties:
 *               value:
 *                 type: string
 *               displayValue:
 *                 type: string
 *               color:
 *                 type: string
 *                 description: Mã màu HEX (cho filterType=color)
 *     responses:
 *       200:
 *         description: Thêm giá trị thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy thuộc tính
 */

