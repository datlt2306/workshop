import { Voucher } from "../models/voucherModel"
import { AppError } from "../utils/appError"
import { asyncHandler } from "../utils/asyncHandler"
import { APIFeatures } from "../utils/apiFeatures"

// Lấy tất cả voucher (admin)
export const getAllVouchers = asyncHandler(async (req, res, next) => {
  // Bỏ qua pre middleware để hiển thị tất cả voucher kể cả hết hạn
  const queryBuilder = Voucher.find()

  // Sử dụng APIFeatures để phân trang, lọc, sắp xếp
  const features = new APIFeatures(queryBuilder, req.query).filter().sort().limitFields().paginate()

  const vouchers = await features.query
  const total = await Voucher.countDocuments(features.query._conditions)

  res.status(200).json({
    success: true,
    count: vouchers.length,
    total,
    data: vouchers,
  })
})

// Lấy tất cả voucher có hiệu lực (người dùng)
export const getActiveVouchers = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(
    Voucher.find({
      isActive: true,
      startDate: { $lte: Date.now() },
      endDate: { $gte: Date.now() },
    }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const vouchers = await features.query
  const total = await Voucher.countDocuments({
    isActive: true,
    startDate: { $lte: Date.now() },
    endDate: { $gte: Date.now() },
  })

  res.status(200).json({
    success: true,
    count: vouchers.length,
    total,
    data: vouchers,
  })
})

// Lấy chi tiết voucher theo ID
export const getVoucher = asyncHandler(async (req, res, next) => {
  const voucher = await Voucher.findById(req.params.id)

  if (!voucher) {
    return next(new AppError("Không tìm thấy voucher với ID này", 404))
  }

  res.status(200).json({
    success: true,
    data: voucher,
  })
})

// Lấy chi tiết voucher theo mã code
export const getVoucherByCode = asyncHandler(async (req, res, next) => {
  const { code } = req.params

  const voucher = await Voucher.findOne({
    code: code.toUpperCase(),
    isActive: true,
    startDate: { $lte: Date.now() },
    endDate: { $gte: Date.now() },
  })

  if (!voucher) {
    return next(new AppError("Không tìm thấy voucher hợp lệ với mã này", 404))
  }

  res.status(200).json({
    success: true,
    data: voucher,
  })
})

// Tạo voucher mới (admin)
export const createVoucher = asyncHandler(async (req, res, next) => {
  // Validate đầu vào
  const { code, type, amount, minAmount, startDate, endDate, maxUses, maxUsesPerUser } = req.body

  if (!code || !amount || !endDate) {
    return next(new AppError("Vui lòng cung cấp đầy đủ thông tin voucher", 400))
  }

  // Kiểm tra mã voucher đã tồn tại chưa
  const existingVoucher = await Voucher.findOne({ code: code.toUpperCase() })
  if (existingVoucher) {
    return next(new AppError("Mã voucher đã tồn tại", 400))
  }

  // Tạo voucher mới
  const newVoucher = await Voucher.create(req.body)

  res.status(201).json({
    success: true,
    data: newVoucher,
  })
})

// Cập nhật voucher (admin)
export const updateVoucher = asyncHandler(async (req, res, next) => {
  // Không cho phép cập nhật code (unique key)
  if (req.body.code) {
    delete req.body.code
  }

  const voucher = await Voucher.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!voucher) {
    return next(new AppError("Không tìm thấy voucher với ID này", 404))
  }

  res.status(200).json({
    success: true,
    data: voucher,
  })
})

// Xóa voucher (admin)
export const deleteVoucher = asyncHandler(async (req, res, next) => {
  const voucher = await Voucher.findByIdAndDelete(req.params.id)

  if (!voucher) {
    return next(new AppError("Không tìm thấy voucher với ID này", 404))
  }

  res.status(204).json({
    success: true,
    data: null,
  })
})

// Vô hiệu hóa voucher (admin)
export const deactivateVoucher = asyncHandler(async (req, res, next) => {
  const voucher = await Voucher.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })

  if (!voucher) {
    return next(new AppError("Không tìm thấy voucher với ID này", 404))
  }

  res.status(200).json({
    success: true,
    data: voucher,
  })
})

