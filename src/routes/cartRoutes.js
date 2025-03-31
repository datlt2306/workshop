import express from "express"
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyVoucher,
  removeVoucher,
} from "../controllers/cartController"
import { verifyJWT } from "../middleware/auth"
import { validateRequest } from "../middleware/validateRequest"
import { addToCartSchema, updateCartItemSchema } from "../validation/cartValidation"

export const cartRouter = express.Router()

// Tất cả các route đều yêu cầu đăng nhập
cartRouter.use(verifyJWT)

// Lấy giỏ hàng hiện tại
cartRouter.get("/", getCart)

// Thêm sản phẩm vào giỏ hàng
cartRouter.post("/add", validateRequest(addToCartSchema), addToCart)

// Cập nhật số lượng sản phẩm trong giỏ hàng
cartRouter.patch("/update/:itemId", validateRequest(updateCartItemSchema), updateCartItem)

// Xóa sản phẩm khỏi giỏ hàng
cartRouter.delete("/remove/:itemId", removeFromCart)

// Xóa toàn bộ giỏ hàng
cartRouter.delete("/clear", clearCart)

// Áp dụng voucher
cartRouter.post("/voucher", applyVoucher)

// Xóa voucher
cartRouter.delete("/voucher", removeVoucher)

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API endpoints for cart management
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Lấy giỏ hàng hiện tại của người dùng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về giỏ hàng hiện tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: object
 *                           quantity:
 *                             type: integer
 *                           price:
 *                             type: number
 *                     totalItems:
 *                       type: integer
 *                     totalPrice:
 *                       type: number
 *                     voucher:
 *                       type: object
 *                       nullable: true
 *       401:
 *         description: Không được phép, thiếu token xác thực
 *       500:
 *         description: Lỗi server
 *
 * /cart/add:
 *   post:
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Sản phẩm đã được thêm vào giỏ hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       401:
 *         description: Không được phép, thiếu token xác thực
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi server
 *
 * /cart/update/{itemId}:
 *   patch:
 *     summary: Cập nhật số lượng sản phẩm trong giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của sản phẩm trong giỏ hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Số lượng sản phẩm đã được cập nhật
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       401:
 *         description: Không được phép, thiếu token xác thực
 *       404:
 *         description: Không tìm thấy sản phẩm trong giỏ hàng
 *       500:
 *         description: Lỗi server
 *
 * /cart/remove/{itemId}:
 *   delete:
 *     summary: Xóa sản phẩm khỏi giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của sản phẩm trong giỏ hàng
 *     responses:
 *       200:
 *         description: Sản phẩm đã được xóa khỏi giỏ hàng
 *       401:
 *         description: Không được phép, thiếu token xác thực
 *       404:
 *         description: Không tìm thấy sản phẩm trong giỏ hàng
 *       500:
 *         description: Lỗi server
 *
 * /cart/clear:
 *   delete:
 *     summary: Xóa toàn bộ giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Giỏ hàng đã được xóa
 *       401:
 *         description: Không được phép, thiếu token xác thực
 *       500:
 *         description: Lỗi server
 *
 * /cart/voucher:
 *   post:
 *     summary: Áp dụng voucher vào giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Voucher đã được áp dụng
 *       400:
 *         description: Mã voucher không hợp lệ
 *       401:
 *         description: Không được phép, thiếu token xác thực
 *       404:
 *         description: Không tìm thấy voucher
 *       500:
 *         description: Lỗi server
 *
 *   delete:
 *     summary: Xóa voucher khỏi giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Voucher đã được xóa khỏi giỏ hàng
 *       401:
 *         description: Không được phép, thiếu token xác thực
 *       500:
 *         description: Lỗi server
 */

