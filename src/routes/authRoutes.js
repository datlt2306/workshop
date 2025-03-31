import express from "express"
import { signup, login, getMe, updatePassword, forgotPassword, resetPassword } from "../controllers/authController"
import { verifyJWT } from "../middleware/auth"
import { validateRequest } from "../middleware/validateRequest"
import { signupSchema, loginSchema, updatePasswordSchema } from "../validation/authValidation"

export const authRouter = express.Router()

// Đăng ký và đăng nhập
authRouter.post("/signup", validateRequest(signupSchema), signup)
authRouter.post("/login", validateRequest(loginSchema), login)

// Lấy thông tin người dùng hiện tại
authRouter.get("/me", verifyJWT, getMe)

// Cập nhật mật khẩu
authRouter.patch("/update-password", verifyJWT, validateRequest(updatePasswordSchema), updatePassword)

// Quên mật khẩu
authRouter.post("/forgot-password", forgotPassword)
authRouter.patch("/reset-password/:token", resetPassword)

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tài khoản đã được tạo và token đăng nhập
 *
 * /auth/login:
 *   post:
 *     summary: Đăng nhập vào hệ thống
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về token và thông tin người dùng
 *       401:
 *         description: Email hoặc mật khẩu không đúng
 *
 * /auth/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin người dùng hiện tại
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *
 * /auth/update-password:
 *   patch:
 *     summary: Cập nhật mật khẩu người dùng
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - passwordCurrent
 *               - password
 *             properties:
 *               passwordCurrent:
 *                 type: string
 *                 description: Mật khẩu hiện tại
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: Mật khẩu mới
 *     responses:
 *       200:
 *         description: Mật khẩu đã được cập nhật và token mới đã được cấp
 *       401:
 *         description: Mật khẩu hiện tại không đúng
 *
 * /auth/forgot-password:
 *   post:
 *     summary: Yêu cầu đặt lại mật khẩu
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Token đặt lại mật khẩu đã được gửi đến email
 *       404:
 *         description: Không tìm thấy người dùng với email cung cấp
 *
 * /auth/reset-password/{token}:
 *   patch:
 *     summary: Đặt lại mật khẩu với token
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token xác nhận đặt lại mật khẩu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Mật khẩu đã được đặt lại và token đăng nhập mới
 *       400:
 *         description: Token không hợp lệ hoặc đã hết hạn
 */

