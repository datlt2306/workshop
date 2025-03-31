import express from "express"
import { verifyJWT, restrictTo } from "../middleware/auth"
import {
  getAllVouchers,
  getActiveVouchers,
  getVoucher,
  getVoucherByCode,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  deactivateVoucher,
} from "../controllers/voucherController"

const router = express.Router()

// Các route dành cho người dùng đã đăng nhập
router.use(verifyJWT)

// Route lấy voucher dành cho người dùng
router.get("/active", getActiveVouchers)
router.get("/code/:code", getVoucherByCode)

// Các route dành cho admin
router.use(restrictTo("admin"))

router.route("/").get(getAllVouchers).post(createVoucher)

router.route("/:id").get(getVoucher).patch(updateVoucher).delete(deleteVoucher)

router.patch("/:id/deactivate", deactivateVoucher)

export default router

/**
 * @swagger
 * /vouchers/active:
 *   get:
 *     summary: Lấy danh sách voucher đang hoạt động
 *     tags: [Vouchers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách voucher đang hoạt động
 *       401:
 *         description: Chưa đăng nhập
 *
 * /vouchers/code/{code}:
 *   get:
 *     summary: Lấy voucher theo mã code
 *     tags: [Vouchers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã voucher
 *     responses:
 *       200:
 *         description: Thông tin voucher
 *       404:
 *         description: Không tìm thấy voucher
 *
 * /vouchers:
 *   get:
 *     summary: Lấy tất cả voucher (chỉ admin)
 *     tags: [Vouchers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách tất cả voucher
 *       401:
 *         description: Không có quyền truy cập
 *   post:
 *     summary: Tạo voucher mới (chỉ admin)
 *     tags: [Vouchers]
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
 *               - discountType
 *               - discountValue
 *             properties:
 *               code:
 *                 type: string
 *                 description: Mã voucher (sẽ tự động chuyển thành chữ hoa)
 *               description:
 *                 type: string
 *                 description: Mô tả voucher
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 description: Loại giảm giá (phần trăm hoặc cố định)
 *               discountValue:
 *                 type: number
 *                 description: Giá trị giảm giá (phần trăm hoặc số tiền cố định)
 *               maxDiscount:
 *                 type: number
 *                 description: Giảm giá tối đa (cho voucher phần trăm)
 *               minAmount:
 *                 type: number
 *                 description: Giá trị đơn hàng tối thiểu để áp dụng
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Ngày bắt đầu hiệu lực
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Ngày kết thúc hiệu lực
 *               maxUses:
 *                 type: number
 *                 description: Số lần sử dụng tối đa
 *               maxUsesPerUser:
 *                 type: number
 *                 description: Số lần sử dụng tối đa cho mỗi người dùng
 *               isActive:
 *                 type: boolean
 *                 description: Trạng thái hoạt động
 *     responses:
 *       201:
 *         description: Tạo voucher thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *
 * /vouchers/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết voucher (chỉ admin)
 *     tags: [Vouchers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của voucher
 *     responses:
 *       200:
 *         description: Thông tin chi tiết voucher
 *       404:
 *         description: Không tìm thấy voucher
 *       401:
 *         description: Không có quyền truy cập
 *   patch:
 *     summary: Cập nhật thông tin voucher (chỉ admin)
 *     tags: [Vouchers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của voucher
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Mô tả voucher
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 description: Loại giảm giá (phần trăm hoặc cố định)
 *               discountValue:
 *                 type: number
 *                 description: Giá trị giảm giá (phần trăm hoặc số tiền cố định)
 *               maxDiscount:
 *                 type: number
 *                 description: Giảm giá tối đa (cho voucher phần trăm)
 *               minAmount:
 *                 type: number
 *                 description: Giá trị đơn hàng tối thiểu để áp dụng
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Ngày bắt đầu hiệu lực
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Ngày kết thúc hiệu lực
 *               maxUses:
 *                 type: number
 *                 description: Số lần sử dụng tối đa
 *               maxUsesPerUser:
 *                 type: number
 *                 description: Số lần sử dụng tối đa cho mỗi người dùng
 *               isActive:
 *                 type: boolean
 *                 description: Trạng thái hoạt động
 *     responses:
 *       200:
 *         description: Cập nhật voucher thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy voucher
 *   delete:
 *     summary: Xóa voucher (chỉ admin)
 *     tags: [Vouchers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của voucher
 *     responses:
 *       204:
 *         description: Xóa voucher thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy voucher
 *
 * /vouchers/{id}/deactivate:
 *   patch:
 *     summary: Vô hiệu hóa voucher (chỉ admin)
 *     tags: [Vouchers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của voucher
 *     responses:
 *       200:
 *         description: Vô hiệu hóa voucher thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy voucher
 */

