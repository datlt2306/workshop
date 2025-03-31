import express from "express"
import {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
  createPaymentIntent,
  handlePaymentSuccess,
} from "../controllers/orderController"
import { verifyJWT, restrictTo } from "../middleware/auth"
import { validateRequest } from "../middleware/validateRequest"
import {
  cancelOrderSchema,
  createOrderSchema,
  paymentSuccessSchema,
  updateOrderStatusSchema,
  createPaymentIntentSchema,
} from "../validation/orderValidation"

export const orderRouter = express.Router()

// Protect all routes
orderRouter.use(verifyJWT)

// Customer routes
orderRouter.post("/", validateRequest(createOrderSchema), createOrder)
orderRouter.get("/my-orders", getMyOrders)
orderRouter.get("/:id", getOrder)
orderRouter.patch("/:id/cancel", validateRequest(cancelOrderSchema), cancelOrder)

// Payment routes
orderRouter.post("/:id/payment-intent", validateRequest(createPaymentIntentSchema), createPaymentIntent)
orderRouter.post("/:id/payment-success", validateRequest(paymentSuccessSchema), handlePaymentSuccess)

// Admin and Staff routes
orderRouter.use(restrictTo("admin", "staff"))
orderRouter.get("/", getAllOrders)
orderRouter.patch("/:id/status", validateRequest(updateOrderStatusSchema), updateOrderStatus)
orderRouter.get("/stats/overview", getOrderStats)
orderRouter.get("/stats/by-date-range", getOrderStats)

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shippingAddress
 *               - paymentMethod
 *             properties:
 *               shippingAddress:
 *                 type: object
 *                 required:
 *                   - fullName
 *                   - phone
 *                   - province
 *                   - district
 *                   - ward
 *                   - streetAddress
 *                 properties:
 *                   fullName:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   province:
 *                     type: string
 *                   district:
 *                     type: string
 *                   ward:
 *                     type: string
 *                   streetAddress:
 *                     type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [cod, vnpay, momo, zalopay, credit_card]
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đơn hàng đã được tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc giỏ hàng trống
 *       401:
 *         description: Không có quyền truy cập
 *   get:
 *     summary: Lấy tất cả đơn hàng (admin/staff)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Lọc theo trạng thái đơn hàng
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng đơn hàng mỗi trang
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sắp xếp (ví dụ - -createdAt)
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không đủ quyền hạn
 *
 * /orders/my-orders:
 *   get:
 *     summary: Lấy danh sách đơn hàng của người dùng hiện tại
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Lọc theo trạng thái đơn hàng
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng đơn hàng mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng của người dùng
 *       401:
 *         description: Không có quyền truy cập
 *
 * /orders/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết đơn hàng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng
 *     responses:
 *       200:
 *         description: Thông tin chi tiết đơn hàng
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không đủ quyền hạn
 *       404:
 *         description: Không tìm thấy đơn hàng
 *
 * /orders/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái đơn hàng (admin/staff)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không đủ quyền hạn
 *       404:
 *         description: Không tìm thấy đơn hàng
 *
 * /orders/{id}/cancel:
 *   patch:
 *     summary: Hủy đơn hàng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cancelReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hủy đơn hàng thành công
 *       400:
 *         description: Không thể hủy đơn hàng ở trạng thái hiện tại
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy đơn hàng
 *
 * /orders/{id}/payment-intent:
 *   post:
 *     summary: Tạo payment intent cho đơn hàng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng
 *     responses:
 *       200:
 *         description: Payment intent được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientSecret:
 *                   type: string
 *       400:
 *         description: Đơn hàng không hợp lệ cho thanh toán
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy đơn hàng
 *
 * /orders/{id}/payment-success:
 *   post:
 *     summary: Xử lý sau khi thanh toán thành công
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentIntentId
 *             properties:
 *               paymentIntentId:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       200:
 *         description: Xử lý thanh toán thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy đơn hàng
 *
 * /orders/stats/overview:
 *   get:
 *     summary: Lấy thống kê tổng quan về đơn hàng (admin/staff)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thống kê tổng quan về đơn hàng
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không đủ quyền hạn
 *
 * /orders/stats/by-date-range:
 *   get:
 *     summary: Lấy thống kê đơn hàng theo khoảng thời gian (admin/staff)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc
 *     responses:
 *       200:
 *         description: Thống kê đơn hàng theo khoảng thời gian
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Không đủ quyền hạn
 */

