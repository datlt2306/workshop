import jwt from "jsonwebtoken";
import { promisify } from "util";
import { User } from "../models/userModel";
import { AppError } from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";

// Tạo JWT token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "30d",
    });
};

// Tạo và gửi token trong response
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        success: true,
        token,
        user,
    });
};

// Đăng ký người dùng mới
export const signup = asyncHandler(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
    });

    createSendToken(newUser, 201, res);
});

// Đăng nhập
export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Kiểm tra email và password có tồn tại
    if (!email || !password) {
        return next(new AppError("Vui lòng cung cấp email và mật khẩu!", 400));
    }

    // 2) Kiểm tra user có tồn tại && password có đúng
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Email hoặc mật khẩu không đúng", 401));
    }

    // 3) Nếu mọi thứ OK, gửi token cho client
    createSendToken(user, 200, res);
});

// Lấy thông tin người dùng đang đăng nhập
export const getMe = asyncHandler(async (req, res, next) => {
    // Lấy user từ middleware auth
    const user = req.user;

    res.status(200).json({
        success: true,
        data: user,
    });
});

// Cập nhật mật khẩu
export const updatePassword = asyncHandler(async (req, res, next) => {
    // 1) Lấy user từ collection
    const user = await User.findById(req.user.id).select("+password");

    // 2) Kiểm tra mật khẩu hiện tại được gửi có đúng không
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError("Mật khẩu hiện tại của bạn không đúng.", 401));
    }

    // 3) Nếu đúng, cập nhật mật khẩu
    user.password = req.body.password;
    await user.save();

    // 4) Đăng nhập lại user, gửi JWT
    createSendToken(user, 200, res);
});

// Quên mật khẩu - gửi email xác nhận
export const forgotPassword = asyncHandler(async (req, res, next) => {
    // 1) Lấy user dựa trên email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError("Không tìm thấy người dùng với email này.", 404));
    }

    // 2) Tạo token xác nhận (thông thường sẽ gửi qua email)
    // Trong ví dụ này, chúng ta sẽ giả lập việc gửi email bằng cách trả về resetToken
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "10m",
    });

    // 3) Gửi thông báo thành công
    res.status(200).json({
        success: true,
        message: "Token xác nhận đã được gửi đến email của bạn.",
        resetToken, // Trong thực tế, không gửi token trong response
    });
});

// Đặt lại mật khẩu
export const resetPassword = asyncHandler(async (req, res, next) => {
    // 1) Lấy user dựa trên token
    const decoded = await promisify(jwt.verify)(req.params.token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
        return next(new AppError("Token không hợp lệ hoặc đã hết hạn", 400));
    }

    // 2) Đặt mật khẩu mới
    user.password = req.body.password;
    await user.save();

    // 3) Đăng nhập lại user, gửi JWT
    createSendToken(user, 200, res);
});
