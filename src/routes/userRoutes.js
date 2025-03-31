import express from "express"
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  getMyAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  countUsersByRole,
} from "../controllers/userController"
import { verifyJWT, restrictTo } from "../middleware/auth"
import { upload } from "../middleware/uploadMiddleware"
import { validateRequest } from "../middleware/validateRequest"
import { addressSchema, updateUserSchema } from "../validation/userValidation"

export const userRouter = express.Router()

// Protect all routes
userRouter.use(verifyJWT)

// User routes
userRouter.patch("/update-me", upload.single("photo"), validateRequest(updateUserSchema), updateMe)

// Address routes
userRouter.get("/addresses", getMyAddresses)
userRouter.post("/addresses", validateRequest(addressSchema), addAddress)
userRouter.patch("/addresses/:addressId", validateRequest(addressSchema), updateAddress)
userRouter.delete("/addresses/:addressId", deleteAddress)
userRouter.patch("/addresses/:addressId/set-default", setDefaultAddress)

// Admin only routes
userRouter.use(restrictTo("admin"))
userRouter.route("/").get(getAllUsers).post(createUser)
userRouter.get("/count", countUsersByRole)
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser)

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *       401:
 *         description: Không có quyền truy cập
 *   post:
 *     summary: Tạo người dùng mới (admin only)
 *     tags: [Users]
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
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, staff, admin]
 *     responses:
 *       201:
 *         description: Tạo người dùng thành công
 *
 * /users/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết người dùng (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Thông tin chi tiết người dùng
 *       404:
 *         description: Không tìm thấy người dùng
 *   patch:
 *     summary: Cập nhật thông tin người dùng (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, staff, admin]
 *               accountStatus:
 *                 type: string
 *                 enum: [active, inactive, banned]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy người dùng
 *   delete:
 *     summary: Xóa người dùng (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       204:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy người dùng
 *
 * /users/update-me:
 *   patch:
 *     summary: Cập nhật thông tin cá nhân
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *
 * /users/addresses:
 *   get:
 *     summary: Lấy danh sách địa chỉ của người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách địa chỉ
 *   post:
 *     summary: Thêm địa chỉ mới
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - phone
 *               - province
 *               - district
 *               - ward
 *               - streetAddress
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               province:
 *                 type: string
 *               district:
 *                 type: string
 *               ward:
 *                 type: string
 *               streetAddress:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Thêm địa chỉ thành công
 */

