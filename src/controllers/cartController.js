import { Cart } from "../models/cartModel"
import { Product } from "../models/productModel"
import { ProductVariant } from "../models/productVariantModel"
import { Voucher } from "../models/voucherModel"
import { AppError } from "../utils/appError"
import { asyncHandler } from "../utils/asyncHandler"

// Lấy giỏ hàng hiện tại của người dùng
export const getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id })

  if (!cart) {
    // Tạo giỏ hàng mới nếu chưa có
    cart = await Cart.create({
      user: req.user.id,
      items: [],
      totalItems: 0,
      subtotal: 0,
      discount: 0,
      total: 0,
    })
  }

  res.status(200).json({
    success: true,
    data: cart,
  })
})

// Thêm sản phẩm vào giỏ hàng
export const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, variantId, quantity = 1 } = req.body

  // Kiểm tra sản phẩm tồn tại
  const product = await Product.findById(productId)
  if (!product) {
    return next(new AppError("Không tìm thấy sản phẩm", 404))
  }

  // Kiểm tra biến thể nếu có
  let variant = null
  let price = product.price
  let stock = product.stock

  if (variantId) {
    variant = await ProductVariant.findById(variantId)
    if (!variant || variant.product.toString() !== productId) {
      return next(new AppError("Biến thể không hợp lệ", 400))
    }
    price = variant.price
    stock = variant.stock
  }

  // Kiểm tra số lượng tồn kho
  if (quantity > stock) {
    return next(new AppError("Số lượng vượt quá tồn kho", 400))
  }

  // Tìm hoặc tạo giỏ hàng
  let cart = await Cart.findOne({ user: req.user.id })

  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: [],
      totalItems: 0,
      subtotal: 0,
      discount: 0,
      total: 0,
    })
  }

  // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
  const existingItemIndex = cart.items.findIndex((item) => {
    if (variantId) {
      return item.variant && item.variant.toString() === variantId
    }
    return item.product.toString() === productId && !item.variant
  })

  if (existingItemIndex > -1) {
    // Cập nhật số lượng nếu sản phẩm đã có trong giỏ hàng
    const newQuantity = cart.items[existingItemIndex].quantity + quantity

    if (newQuantity > stock) {
      return next(new AppError("Số lượng vượt quá tồn kho", 400))
    }

    cart.items[existingItemIndex].quantity = newQuantity
  } else {
    // Thêm sản phẩm mới vào giỏ hàng
    const newItem = {
      product: productId,
      quantity,
      price,
    }

    if (variantId) {
      newItem.variant = variantId
    }

    cart.items.push(newItem)
  }

  // Cập nhật tổng giỏ hàng
  await cart.updateCartTotals()

  res.status(200).json({
    success: true,
    data: cart,
  })
})

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params
  const { quantity } = req.body

  if (quantity < 1) {
    return next(new AppError("Số lượng phải lớn hơn 0", 400))
  }

  // Tìm giỏ hàng
  const cart = await Cart.findOne({ user: req.user.id })

  if (!cart) {
    return next(new AppError("Không tìm thấy giỏ hàng", 404))
  }

  // Tìm sản phẩm trong giỏ hàng
  const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId)

  if (itemIndex === -1) {
    return next(new AppError("Không tìm thấy sản phẩm trong giỏ hàng", 404))
  }

  // Kiểm tra tồn kho
  const item = cart.items[itemIndex]
  let stock

  if (item.variant) {
    const variant = await ProductVariant.findById(item.variant)
    stock = variant ? variant.stock : 0
  } else {
    const product = await Product.findById(item.product)
    stock = product ? product.stock : 0
  }

  if (quantity > stock) {
    return next(new AppError("Số lượng vượt quá tồn kho", 400))
  }

  // Cập nhật số lượng
  cart.items[itemIndex].quantity = quantity

  // Cập nhật tổng giỏ hàng
  await cart.updateCartTotals()

  res.status(200).json({
    success: true,
    data: cart,
  })
})

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params

  // Tìm giỏ hàng
  const cart = await Cart.findOne({ user: req.user.id })

  if (!cart) {
    return next(new AppError("Không tìm thấy giỏ hàng", 404))
  }

  // Tìm và xóa sản phẩm
  const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId)

  if (itemIndex === -1) {
    return next(new AppError("Không tìm thấy sản phẩm trong giỏ hàng", 404))
  }

  cart.items.splice(itemIndex, 1)

  // Cập nhật tổng giỏ hàng
  await cart.updateCartTotals()

  res.status(200).json({
    success: true,
    data: cart,
  })
})

// Xóa toàn bộ giỏ hàng
export const clearCart = asyncHandler(async (req, res, next) => {
  // Tìm giỏ hàng
  const cart = await Cart.findOne({ user: req.user.id })

  if (!cart) {
    return next(new AppError("Không tìm thấy giỏ hàng", 404))
  }

  // Xóa tất cả sản phẩm
  cart.items = []
  cart.voucher = undefined

  // Cập nhật tổng giỏ hàng
  await cart.updateCartTotals()

  res.status(200).json({
    success: true,
    data: cart,
  })
})

// Áp dụng voucher
export const applyVoucher = asyncHandler(async (req, res, next) => {
  const { code } = req.body

  if (!code) {
    return next(new AppError("Vui lòng cung cấp mã voucher", 400))
  }

  // Tìm voucher
  const voucher = await Voucher.findOne({ code: code.toUpperCase() })

  if (!voucher) {
    return next(new AppError("Voucher không tồn tại", 404))
  }

  // Kiểm tra voucher còn hiệu lực
  if (!voucher.isValid()) {
    return next(new AppError("Voucher đã hết hạn hoặc không còn hiệu lực", 400))
  }

  // Kiểm tra người dùng có thể sử dụng voucher
  if (!voucher.isValidForUser(req.user.id)) {
    return next(new AppError("Bạn đã sử dụng hết số lần cho phép của voucher này", 400))
  }

  // Tìm giỏ hàng
  const cart = await Cart.findOne({ user: req.user.id })

  if (!cart) {
    return next(new AppError("Không tìm thấy giỏ hàng", 404))
  }

  // Kiểm tra giá trị tối thiểu
  if (cart.subtotal < voucher.minAmount) {
    return next(new AppError(`Giá trị đơn hàng phải từ ${voucher.minAmount.toLocaleString("vi-VN")}₫ trở lên`, 400))
  }

  // Áp dụng voucher
  cart.voucher = voucher._id
  cart.discount = voucher.calculateDiscount(cart.subtotal)
  cart.total = cart.subtotal - cart.discount

  await cart.save()

  res.status(200).json({
    success: true,
    data: cart,
  })
})

// Xóa voucher
export const removeVoucher = asyncHandler(async (req, res, next) => {
  // Tìm giỏ hàng
  const cart = await Cart.findOne({ user: req.user.id })

  if (!cart) {
    return next(new AppError("Không tìm thấy giỏ hàng", 404))
  }

  // Xóa voucher
  cart.voucher = undefined
  cart.discount = 0
  cart.total = cart.subtotal

  await cart.save()

  res.status(200).json({
    success: true,
    data: cart,
  })
})

