import { Notification, User } from "../models";
import { AppError } from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";

// Tạo thông báo mới
export const createNotification = asyncHandler(async (req, res, next) => {
    const { type, title, message, userId, orderId, orderNumber, total } = req.body;

    // Xác thực dữ liệu đầu vào
    if (!type) {
        return next(new AppError("Vui lòng cung cấp loại thông báo", StatusCodes.BAD_REQUEST));
    }

    // Nếu không có userId, thông báo sẽ được gửi cho admin
    let recipients = [];
    if (userId) {
        recipients = [userId];
    } else {
        // Lấy tất cả admin và staff
        const admins = await User.find({ role: { $in: ["admin", "staff"] } }).select("_id");
        recipients = admins.map((admin) => admin._id);
    }

    // Tạo thông báo cho từng người nhận
    const notifications = await Promise.all(
        recipients.map((recipient) =>
            Notification.create({
                recipient,
                type,
                title: title || getDefaultTitle(type, orderNumber),
                message: message || getDefaultMessage(type, orderNumber, total),
                data: {
                    orderId,
                    orderNumber,
                    total,
                },
                isRead: false,
            })
        )
    );

    // Gửi thông báo realtime (sẽ triển khai sau với WebSocket hoặc Server-Sent Events)
    // sendRealtimeNotification(notifications)

    res.status(StatusCodes.CREATED).json({
        success: true,
        data: notifications,
    });
});

// Lấy thông báo của người dùng hiện tại
export const getMyNotifications = asyncHandler(async (req, res, next) => {
    const notifications = await Notification.find({ recipient: req.user.id })
        .sort({ createdAt: -1 })
        .limit(50);

    res.status(StatusCodes.OK).json({
        success: true,
        count: notifications.length,
        data: notifications,
    });
});

// Đánh dấu thông báo đã đọc
export const markAsRead = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
        return next(new AppError("Không tìm thấy thông báo", StatusCodes.NOT_FOUND));
    }

    // Kiểm tra quyền truy cập
    if (notification.recipient.toString() !== req.user.id) {
        return next(new AppError("Bạn không có quyền truy cập thông báo này", 403));
    }

    notification.isRead = true;
    await notification.save();

    res.status(StatusCodes.OK).json({
        success: true,
        data: notification,
    });
});

// Đánh dấu tất cả thông báo đã đọc
export const markAllAsRead = asyncHandler(async (req, res, next) => {
    await Notification.updateMany({ recipient: req.user.id, isRead: false }, { isRead: true });

    res.status(StatusCodes.OK).json({
        success: true,
        message: "Đã đánh dấu tất cả thông báo là đã đọc",
    });
});

// Xóa thông báo
export const deleteNotification = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
        return next(new AppError("Không tìm thấy thông báo", StatusCodes.NOT_FOUND));
    }

    // Kiểm tra quyền truy cập
    if (notification.recipient.toString() !== req.user.id) {
        return next(new AppError("Bạn không có quyền xóa thông báo này", 403));
    }

    await notification.deleteOne();

    res.status(204).json({
        success: true,
        data: null,
    });
});

// Hàm helper để tạo tiêu đề thông báo mặc định
const getDefaultTitle = (type, orderNumber) => {
    switch (type) {
        case "order_created":
            return `Đơn hàng mới #${orderNumber}`;
        case "order_status_changed":
            return `Cập nhật đơn hàng #${orderNumber}`;
        case "payment_received":
            return `Thanh toán đơn hàng #${orderNumber}`;
        default:
            return "Thông báo mới";
    }
};

// Hàm helper để tạo nội dung thông báo mặc định
const getDefaultMessage = (type, orderNumber, total) => {
    switch (type) {
        case "order_created":
            return `Đơn hàng #${orderNumber} đã được tạo với tổng giá trị ${total?.toLocaleString(
                "vi-VN"
            )}₫`;
        case "order_status_changed":
            return `Trạng thái đơn hàng #${orderNumber} đã được cập nhật`;
        case "payment_received":
            return `Đã nhận thanh toán cho đơn hàng #${orderNumber} với số tiền ${total?.toLocaleString(
                "vi-VN"
            )}₫`;
        default:
            return "Bạn có thông báo mới";
    }
};
