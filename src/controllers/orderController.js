import { Order, Cart, Product, ProductVariant, Notification, User } from "../models";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/appError";
import { StatusCodes } from "http-status-codes";

// Get all orders (admin/staff only)
export const getAllOrders = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10, sort = "-createdAt" } = req.query;

    const query = {};
    if (status) {
        query.status = status;
    }

    const options = {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        sort,
        populate: [
            { path: "user", select: "name email" },
            { path: "items.product", select: "name images" },
            { path: "items.variant", select: "attributeValues" },
        ],
    };

    const orders = await Order.paginate(query, options);

    res.status(StatusCodes.OK).json({
        status: "success",
        data: orders,
    });
});

// Get orders of current user
export const getMyOrders = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: req.user.id };
    if (status) {
        query.status = status;
    }

    const options = {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        sort: "-createdAt",
        populate: [
            { path: "items.product", select: "name images" },
            { path: "items.variant", select: "attributeValues" },
        ],
    };

    const orders = await Order.paginate(query, options);

    res.status(StatusCodes.OK).json({
        status: "success",
        data: orders,
    });
});

// Get order by ID
export const getOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate("user", "name email phone")
        .populate("items.product", "name price images")
        .populate("items.variant", "attributeValues price");

    if (!order) {
        throw new AppError("Không tìm thấy đơn hàng", StatusCodes.NOT_FOUND);
    }

    // Check if user is the owner of the order or admin/staff
    if (order.user._id.toString() !== req.user.id && !["admin", "staff"].includes(req.user.role)) {
        throw new AppError("Bạn không có quyền truy cập đơn hàng này", 403);
    }

    res.status(StatusCodes.OK).json({
        status: "success",
        data: order,
    });
});

// Create new order
export const createOrder = asyncHandler(async (req, res) => {
    // 1. Get user cart
    const cart = await Cart.findOne({ user: req.user.id })
        .populate({
            path: "items.product",
            select: "name price images stock",
        })
        .populate({
            path: "items.variant",
            select: "price stock attributeValues",
        });

    if (!cart || cart.items.length === 0) {
        throw new AppError("Giỏ hàng của bạn đang trống", StatusCodes.BAD_REQUEST);
    }

    // 2. Verify products availability and update inventory
    for (const item of cart.items) {
        const product = item.product;
        const variant = item.variant;

        if (!product) {
            throw new AppError(`Sản phẩm không tồn tại`, StatusCodes.BAD_REQUEST);
        }

        // Check stock from variant if exists, otherwise from product
        const currentStock = variant ? variant.stock : product.stock;

        if (currentStock < item.quantity) {
            throw new AppError(
                `Sản phẩm ${product.name} không đủ số lượng trong kho`,
                StatusCodes.BAD_REQUEST
            );
        }

        // Update product or variant inventory
        if (variant) {
            variant.stock -= item.quantity;
            await variant.save();

            // Update product total stock
            await updateProductTotalStock(product._id);
        } else {
            product.stock -= item.quantity;
            await product.save();
        }
    }

    // 3. Create order
    const orderItems = cart.items.map((item) => {
        const variant = item.variant;
        return {
            product: item.product._id,
            variant: variant ? variant._id : undefined,
            name: item.product.name,
            quantity: item.quantity,
            price: variant ? variant.price : item.product.price,
            attributes: variant ? variant.attributeValues : [],
            image:
                item.product.images && item.product.images.length > 0
                    ? item.product.images[0]
                    : null,
        };
    });

    const newOrder = await Order.create({
        user: req.user.id,
        items: orderItems,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        subtotal: cart.subtotal,
        shippingFee: req.body.shippingFee || 0,
        discount: cart.discount || 0,
        total: cart.total + (req.body.shippingFee || 0),
        voucher: cart.voucher,
        note: req.body.note,
        orderNumber: generateOrderNumber(),
        statusHistory: [
            {
                status: "pending",
                date: Date.now(),
                note: "Đơn hàng mới được tạo",
            },
        ],
    });

    // 4. Clear cart after order created
    cart.items = [];
    cart.voucher = null;
    cart.discount = 0;
    cart.subtotal = 0;
    cart.total = 0;
    await cart.save();

    // 5. Create notification for user
    await Notification.create({
        recipient: req.user.id,
        type: "order_created",
        title: `Đơn hàng #${newOrder.orderNumber} đã được tạo`,
        message: `Đơn hàng của bạn đã được tạo thành công với tổng giá trị ${newOrder.total.toLocaleString(
            "vi-VN"
        )}₫`,
        data: {
            orderId: newOrder._id,
            orderNumber: newOrder.orderNumber,
        },
    });

    // 6. Create notification for admin/staff
    const adminUsers = await User.find({ role: { $in: ["admin", "staff"] } }).select("_id");
    for (const admin of adminUsers) {
        await Notification.create({
            recipient: admin._id,
            type: "order_created",
            title: `Đơn hàng mới #${newOrder.orderNumber}`,
            message: `Đơn hàng mới đã được tạo bởi ${
                req.user.name
            } với tổng giá trị ${newOrder.total.toLocaleString("vi-VN")}₫`,
            data: {
                orderId: newOrder._id,
                orderNumber: newOrder.orderNumber,
            },
        });
    }

    res.status(StatusCodes.CREATED).json({
        status: "success",
        data: newOrder,
    });
});

// Update order status (admin/staff only)
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!status) {
        throw new AppError("Vui lòng cung cấp trạng thái đơn hàng", StatusCodes.BAD_REQUEST);
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new AppError("Không tìm thấy đơn hàng", StatusCodes.NOT_FOUND);
    }

    // Add status history
    order.statusHistory.push({
        status,
        date: Date.now(),
        note: req.body.note,
        updatedBy: req.user.id,
    });

    // Update current status
    order.status = status;

    // If order is cancelled, restore product inventory
    if (status === "cancelled") {
        await restoreInventory(order);
    }

    // If order is delivered, set deliveredAt
    if (status === "delivered") {
        order.deliveredAt = Date.now();
    }

    // If order is completed, set completedAt
    if (status === "completed") {
        order.completedAt = Date.now();
    }

    await order.save();

    // Create notification for user
    await Notification.create({
        recipient: order.user,
        type: "order_status_changed",
        title: `Đơn hàng #${order.orderNumber} đã được cập nhật`,
        message: `Trạng thái đơn hàng của bạn đã được cập nhật thành ${getStatusText(status)}`,
        data: {
            orderId: order._id,
            orderNumber: order.orderNumber,
            status,
        },
    });

    res.status(StatusCodes.OK).json({
        status: "success",
        data: order,
    });
});

// Cancel order (user)
export const cancelOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new AppError("Không tìm thấy đơn hàng", StatusCodes.NOT_FOUND);
    }

    // Check if user is the owner of the order
    if (order.user.toString() !== req.user.id) {
        throw new AppError("Bạn không có quyền hủy đơn hàng này", 403);
    }

    // Check if order can be cancelled
    if (!["pending", "processing"].includes(order.status)) {
        throw new AppError(
            "Đơn hàng này không thể hủy ở trạng thái hiện tại",
            StatusCodes.BAD_REQUEST
        );
    }

    // Add status history
    order.statusHistory.push({
        status: "cancelled",
        date: Date.now(),
        note: req.body.cancelReason || "Đơn hàng bị hủy bởi người dùng",
        updatedBy: req.user.id,
    });

    // Update current status
    order.status = "cancelled";

    // Restore product inventory
    await restoreInventory(order);

    await order.save();

    // Create notification for admin/staff
    const adminUsers = await User.find({ role: { $in: ["admin", "staff"] } }).select("_id");
    for (const admin of adminUsers) {
        await Notification.create({
            recipient: admin._id,
            type: "order_cancelled",
            title: `Đơn hàng #${order.orderNumber} đã bị hủy`,
            message: `Đơn hàng #${order.orderNumber} đã bị hủy bởi khách hàng với lý do: ${
                req.body.cancelReason || "Không có lý do"
            }`,
            data: {
                orderId: order._id,
                orderNumber: order.orderNumber,
            },
        });
    }

    res.status(StatusCodes.OK).json({
        status: "success",
        data: order,
    });
});

// Create payment intent for an order
export const createPaymentIntent = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new AppError("Không tìm thấy đơn hàng", StatusCodes.NOT_FOUND);
    }

    // Check if user is the owner of the order
    if (order.user.toString() !== req.user.id) {
        throw new AppError("Bạn không có quyền truy cập đơn hàng này", 403);
    }

    // Check if order is already paid
    if (order.isPaid) {
        throw new AppError("Đơn hàng này đã được thanh toán", StatusCodes.BAD_REQUEST);
    }

    // Check if order is cancelled
    if (order.status === "cancelled") {
        throw new AppError("Không thể thanh toán đơn hàng đã bị hủy", StatusCodes.BAD_REQUEST);
    }

    // Implement integration with payment processor (e.g., Stripe, VNPay, etc.)
    // This is a simplified example assuming a Stripe-like interface
    const paymentProcessor = req.body.paymentProcessor || "stripe";
    let paymentIntentData;

    try {
        // In a real implementation, you would call the actual payment service
        // For now, we'll simulate a successful response
        paymentIntentData = {
            id: `pi_${Date.now()}`,
            clientSecret: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
            amount: order.total,
            currency: "vnd",
            status: "requires_payment_method",
        };

        // Save payment intent reference to order
        order.paymentIntent = paymentIntentData.id;
        await order.save();
    } catch (error) {
        throw new AppError(`Lỗi tạo giao dịch thanh toán: ${error.message}`, 500);
    }

    res.status(StatusCodes.OK).json({
        status: "success",
        data: {
            clientSecret: paymentIntentData.clientSecret,
            paymentIntent: paymentIntentData.id,
            amount: paymentIntentData.amount,
            currency: paymentIntentData.currency,
        },
    });
});

// Handle successful payment
export const handlePaymentSuccess = asyncHandler(async (req, res) => {
    const { paymentIntentId, paymentMethod } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new AppError("Không tìm thấy đơn hàng", StatusCodes.NOT_FOUND);
    }

    // Check if order is already paid
    if (order.isPaid) {
        return res.status(StatusCodes.OK).json({
            status: "success",
            message: "Đơn hàng này đã được thanh toán trước đó",
            data: { order },
        });
    }

    // Verify payment with payment provider (in a real implementation)
    // Here we'll just simulate a successful verification

    // Update order payment information
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
        id: paymentIntentId,
        status: "succeeded",
        update_time: new Date().toISOString(),
        payment_method: paymentMethod || order.paymentMethod,
    };

    // Update order status to processing if it's pending
    if (order.status === "pending") {
        order.status = "processing";
        order.statusHistory.push({
            status: "processing",
            date: Date.now(),
            note: "Đơn hàng đã được thanh toán",
            updatedBy: req.user.id,
        });
    }

    await order.save();

    // Create notification for user
    await Notification.create({
        recipient: order.user,
        type: "payment_received",
        title: `Thanh toán đơn hàng #${order.orderNumber} thành công`,
        message: `Thanh toán cho đơn hàng #${
            order.orderNumber
        } đã được xác nhận với số tiền ${order.total.toLocaleString("vi-VN")}₫`,
        data: {
            orderId: order._id,
            orderNumber: order.orderNumber,
        },
    });

    res.status(StatusCodes.OK).json({
        status: "success",
        message: "Thanh toán đơn hàng thành công",
        data: { order },
    });
});

// Get order statistics
export const getOrderStats = asyncHandler(async (req, res) => {
    // Determine which type of stats are being requested based on the route
    const isDateRangeStats = req.path.includes("by-date-range");

    if (isDateRangeStats) {
        // Handle date range statistics
        const { startDate, endDate } = req.query;

        // Validate dates
        if (!startDate || !endDate) {
            throw new AppError(
                "Vui lòng cung cấp ngày bắt đầu và kết thúc",
                StatusCodes.BAD_REQUEST
            );
        }

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        // Validate date range
        if (start > end) {
            throw new AppError("Ngày bắt đầu phải trước ngày kết thúc", StatusCodes.BAD_REQUEST);
        }

        // Get orders within date range
        const dateRangeOrders = await Order.find({
            createdAt: { $gte: start, $lte: end },
        });

        // Count orders by status
        const ordersByStatus = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    revenue: { $sum: "$total" },
                },
            },
        ]);

        // Calculate revenue by day
        const revenueByDay = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end },
                    isPaid: true,
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                    revenue: { $sum: "$total" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.status(StatusCodes.OK).json({
            status: "success",
            data: {
                totalOrders: dateRangeOrders.length,
                ordersByStatus,
                revenueByDay,
                dateRange: { startDate: start, endDate: end },
            },
        });
    } else {
        // Handle overview statistics
        // Get count of orders by status
        const ordersByStatus = await Order.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        // Get revenue stats
        const revenueStats = await Order.aggregate([
            {
                $match: { isPaid: true },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$total" },
                    avgOrderValue: { $avg: "$total" },
                    maxOrderValue: { $max: "$total" },
                    minOrderValue: { $min: "$total" },
                    orderCount: { $sum: 1 },
                },
            },
        ]);

        // Get recent orders
        const recentOrders = await Order.find()
            .sort("-createdAt")
            .limit(5)
            .populate("user", "name email");

        // Get current month revenue
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const currentMonthRevenue = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: currentMonthStart },
                    isPaid: true,
                },
            },
            {
                $group: {
                    _id: null,
                    revenue: { $sum: "$total" },
                    count: { $sum: 1 },
                },
            },
        ]);

        // Get previous month revenue for comparison
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        const previousMonthRevenue = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: previousMonthStart,
                        $lte: previousMonthEnd,
                    },
                    isPaid: true,
                },
            },
            {
                $group: {
                    _id: null,
                    revenue: { $sum: "$total" },
                    count: { $sum: 1 },
                },
            },
        ]);

        res.status(StatusCodes.OK).json({
            status: "success",
            data: {
                ordersByStatus,
                revenue: revenueStats[0] || {
                    totalRevenue: 0,
                    avgOrderValue: 0,
                    maxOrderValue: 0,
                    minOrderValue: 0,
                    orderCount: 0,
                },
                currentMonth: currentMonthRevenue[0] || { revenue: 0, count: 0 },
                previousMonth: previousMonthRevenue[0] || { revenue: 0, count: 0 },
                recentOrders,
            },
        });
    }
});

// Helper functions
async function restoreInventory(order) {
    for (const item of order.items) {
        if (item.variant) {
            // Restore variant stock
            await ProductVariant.findByIdAndUpdate(item.variant, {
                $inc: { stock: item.quantity },
            });

            // Update product total stock
            await updateProductTotalStock(item.product);
        } else {
            // Restore product stock directly
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity },
            });
        }
    }
}

async function updateProductTotalStock(productId) {
    const variants = await ProductVariant.find({ product: productId });
    const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);

    await Product.findByIdAndUpdate(productId, { stock: totalStock });
}

function generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");

    return `ORD-${year}${month}${day}-${random}`;
}

function getStatusText(status) {
    const statusMap = {
        pending: "Chờ xác nhận",
        processing: "Đang xử lý",
        shipped: "Đang giao hàng",
        delivered: "Đã giao hàng",
        completed: "Hoàn thành",
        cancelled: "Đã hủy",
    };

    return statusMap[status] || status;
}
