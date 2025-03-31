import express from "express"
import {
  createNotification,
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController"
import { verifyJWT, restrictTo } from "../middleware/auth"

export const notificationRouter = express.Router()

// Tất cả các route đều yêu cầu đăng nhập
notificationRouter.use(verifyJWT)

// Lấy thông báo của người dùng hiện tại
notificationRouter.get("/", getMyNotifications)

// Đánh dấu tất cả thông báo đã đọc
notificationRouter.patch("/mark-all-read", markAllAsRead)

// Đánh dấu thông báo đã đọc
notificationRouter.patch("/:id/mark-read", markAsRead)

// Xóa thông báo
notificationRouter.delete("/:id", deleteNotification)

// Tạo thông báo mới (chỉ admin và staff)
notificationRouter.post("/", restrictTo("admin", "staff"), createNotification)

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Lấy thông báo của người dùng hiện tại
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách thông báo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 60d21b4667d0d8992e610c85
 *                       title:
 *                         type: string
 *                         example: Thông báo mới
 *                       message:
 *                         type: string
 *                         example: Bạn có một thông báo mới
 *                       isRead:
 *                         type: boolean
 *                         example: false
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Không được xác thực
 *       500:
 *         description: Lỗi máy chủ
 *
 *   post:
 *     summary: Tạo thông báo mới (chỉ admin và staff)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Cập nhật đơn hàng
 *               message:
 *                 type: string
 *                 example: Đơn hàng của bạn đã được xác nhận
 *               userId:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c85
 *     responses:
 *       201:
 *         description: Thông báo đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d21b4667d0d8992e610c85
 *                     title:
 *                       type: string
 *                       example: Cập nhật đơn hàng
 *                     message:
 *                       type: string
 *                       example: Đơn hàng của bạn đã được xác nhận
 *                     isRead:
 *                       type: boolean
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không được xác thực
 *       403:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi máy chủ
 *
 * /notifications/mark-all-read:
 *   patch:
 *     summary: Đánh dấu tất cả thông báo đã đọc
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tất cả thông báo đã được đánh dấu đã đọc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Tất cả thông báo đã được đánh dấu đã đọc
 *       401:
 *         description: Không được xác thực
 *       500:
 *         description: Lỗi máy chủ
 *
 * /notifications/{id}/mark-read:
 *   patch:
 *     summary: Đánh dấu thông báo đã đọc
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của thông báo
 *     responses:
 *       200:
 *         description: Thông báo đã được đánh dấu đã đọc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d21b4667d0d8992e610c85
 *                     isRead:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Không được xác thực
 *       404:
 *         description: Không tìm thấy thông báo
 *       500:
 *         description: Lỗi máy chủ
 *
 * /notifications/{id}:
 *   delete:
 *     summary: Xóa thông báo
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của thông báo
 *     responses:
 *       204:
 *         description: Thông báo đã được xóa
 *       401:
 *         description: Không được xác thực
 *       404:
 *         description: Không tìm thấy thông báo
 *       500:
 *         description: Lỗi máy chủ
 */

