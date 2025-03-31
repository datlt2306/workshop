import jwt from "jsonwebtoken";
import { promisify } from "util";
import { User } from "../models/userModel";
import { AppError } from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";

// Middleware kiểm tra xác thực
export const verifyJWT = asyncHandler(async (req, res, next) => {
    // 1) Lấy token và kiểm tra
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new AppError("Bạn chưa đăng nhập! Vui lòng đăng nhập để truy cập.", 401));
    }

    // 2) Xác minh token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Kiểm tra xem user có tồn tại
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError("Người dùng thuộc token này không còn tồn tại.", 401));
    }

    // 4) Kiểm tra xem password có thay đổi sau khi token được cấp
    if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError("Mật khẩu đã thay đổi gần đây! Vui lòng đăng nhập lại.", 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

// Middleware phân quyền
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'staff']
        if (!roles.includes(req.user.role)) {
            return next(new AppError("Bạn không có quyền thực hiện hành động này", 403));
        }

        next();
    };
};
