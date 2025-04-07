import { Cart, Product, ProductVariant, Voucher } from "../models";
import { AppError } from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";
import { StatusCodes } from "http-status-codes";

// Lấy giỏ hàng hiện tại của người dùng
export const getCart = asyncHandler(async (req, res, next) => {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
        // Tạo giỏ hàng mới nếu chưa có
        cart = await Cart.create({
            user: req.user.id,
            items: [],
            totalItems: 0,
            subtotal: 0,
            discount: 0,
            total: 0,
        });
    }

    res.status(StatusCodes.OK).json({
        success: true,
        data: cart,
    });
});

// Thêm sản phẩm vào giỏ hàng
export const addToCart = asyncHandler(async (req, res, next) => {
    const { productId, variantId, quantity = 1 } = req.body;

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(productId);
    if (!product) {
        return next(new AppError("Không tìm thấy sản phẩm", StatusCodes.NOT_FOUND));
    }

    // Kiểm tra biến thể nếu có
    let variant = null;
    let price = product.price;
    let stock = product.stock;

    if (variantId) {
        variant = await ProductVariant.findById(variantId);
        if (!variant || variant.product.toString() !== productId) {
            return next(new AppError("Biến thể không hợp lệ", StatusCodes.BAD_REQUEST));
        }
        price = variant.price;
        stock = variant.stock;
    }

    // Kiểm tra số lượng tồn kho
    if (quantity > stock) {
        return next(new AppError("Số lượng vượt quá tồn kho", StatusCodes.BAD_REQUEST));
    }

    // Tìm hoặc tạo giỏ hàng
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
        cart = await Cart.create({
            user: req.user.id,
            items: [],
            totalItems: 0,
            subtotal: 0,
            discount: 0,
            total: 0,
        });
    }

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const existingItemIndex = cart.items.findIndex((item) => {
        if (variantId) {
            return item.variant && item.variant.toString() === variantId;
        }
        return item.product.toString() === productId && !item.variant;
    });

    if (existingItemIndex > -1) {
        // Cập nhật số lượng nếu sản phẩm đã có trong giỏ hàng
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;

        if (newQuantity > stock) {
            return next(new AppError("Số lượng vượt quá tồn kho", StatusCodes.BAD_REQUEST));
        }

        cart.items[existingItemIndex].quantity = newQuantity;
    } else {
        // Thêm sản phẩm mới vào giỏ hàng
        const newItem = {
            product: productId,
            quantity,
            price,
        };

        if (variantId) {
            newItem.variant = variantId;
        }

        cart.items.push(newItem);
    }

    // Cập nhật tổng giỏ hàng
    await cart.updateCartTotals();

    res.status(StatusCodes.OK).json({
        success: true,
        data: cart,
    });
});

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = asyncHandler(async (req, res, next) => {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
        return next(new AppError("Số lượng phải lớn hơn 0", StatusCodes.BAD_REQUEST));
    }

    // Tìm giỏ hàng
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
        return next(new AppError("Không tìm thấy giỏ hàng", StatusCodes.NOT_FOUND));
    }

    // Tìm sản phẩm trong giỏ hàng
    const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);

    if (itemIndex === -1) {
        return next(new AppError("Không tìm thấy sản phẩm trong giỏ hàng", StatusCodes.NOT_FOUND));
    }

    // Kiểm tra tồn kho
    const item = cart.items[itemIndex];
    let stock;

    if (item.variant) {
        const variant = await ProductVariant.findById(item.variant);
        stock = variant ? variant.stock : 0;
    } else {
        const product = await Product.findById(item.product);
        stock = product ? product.stock : 0;
    }

    if (quantity > stock) {
        return next(new AppError("Số lượng vượt quá tồn kho", StatusCodes.BAD_REQUEST));
    }

    // Cập nhật số lượng
    cart.items[itemIndex].quantity = quantity;

    // Cập nhật tổng giỏ hàng
    await cart.updateCartTotals();

    res.status(StatusCodes.OK).json({
        success: true,
        data: cart,
    });
});

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = asyncHandler(async (req, res, next) => {
    const { itemId } = req.params;

    // Tìm giỏ hàng
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
        return next(new AppError("Không tìm thấy giỏ hàng", StatusCodes.NOT_FOUND));
    }

    // Tìm và xóa sản phẩm
    const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);

    if (itemIndex === -1) {
        return next(new AppError("Không tìm thấy sản phẩm trong giỏ hàng", StatusCodes.NOT_FOUND));
    }

    cart.items.splice(itemIndex, 1);

    // Cập nhật tổng giỏ hàng
    await cart.updateCartTotals();

    res.status(StatusCodes.OK).json({
        success: true,
        data: cart,
    });
});

// Xóa toàn bộ giỏ hàng
export const clearCart = asyncHandler(async (req, res, next) => {
    // Tìm giỏ hàng
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
        return next(new AppError("Không tìm thấy giỏ hàng", StatusCodes.NOT_FOUND));
    }

    // Xóa tất cả sản phẩm
    cart.items = [];
    cart.voucher = undefined;

    // Cập nhật tổng giỏ hàng
    await cart.updateCartTotals();

    res.status(StatusCodes.OK).json({
        success: true,
        data: cart,
    });
});

// Áp dụng voucher
export const applyVoucher = asyncHandler(async (req, res, next) => {
    const { code } = req.body;

    if (!code) {
        return next(new AppError("Vui lòng cung cấp mã voucher", StatusCodes.BAD_REQUEST));
    }

    // Tìm voucher
    const voucher = await Voucher.findOne({ code: code.toUpperCase() });

    if (!voucher) {
        return next(new AppError("Voucher không tồn tại", StatusCodes.NOT_FOUND));
    }

    // Kiểm tra voucher còn hiệu lực
    if (!voucher.isValid()) {
        return next(
            new AppError("Voucher đã hết hạn hoặc không còn hiệu lực", StatusCodes.BAD_REQUEST)
        );
    }

    // Kiểm tra người dùng có thể sử dụng voucher
    if (!voucher.isValidForUser(req.user.id)) {
        return next(
            new AppError(
                "Bạn đã sử dụng hết số lần cho phép của voucher này",
                StatusCodes.BAD_REQUEST
            )
        );
    }

    // Tìm giỏ hàng
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
        return next(new AppError("Không tìm thấy giỏ hàng", StatusCodes.NOT_FOUND));
    }

    // Kiểm tra giá trị tối thiểu
    if (cart.subtotal < voucher.minAmount) {
        return next(
            new AppError(
                `Giá trị đơn hàng phải từ ${voucher.minAmount.toLocaleString("vi-VN")}₫ trở lên`,
                StatusCodes.BAD_REQUEST
            )
        );
    }

    // Áp dụng voucher
    cart.voucher = voucher._id;
    cart.discount = voucher.calculateDiscount(cart.subtotal);
    cart.total = cart.subtotal - cart.discount;

    await cart.save();

    res.status(StatusCodes.OK).json({
        success: true,
        data: cart,
    });
});

// Xóa voucher
export const removeVoucher = asyncHandler(async (req, res, next) => {
    // Tìm giỏ hàng
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
        return next(new AppError("Không tìm thấy giỏ hàng", StatusCodes.NOT_FOUND));
    }

    // Xóa voucher
    cart.voucher = undefined;
    cart.discount = 0;
    cart.total = cart.subtotal;

    await cart.save();

    res.status(StatusCodes.OK).json({
        success: true,
        data: cart,
    });
});
