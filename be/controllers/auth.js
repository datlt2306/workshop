import User from "../models/user";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { SMTPClient } from "emailjs";
import { StatusCodes } from "http-status-codes";

// Đăng ký người dùng mới
export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email đã được sử dụng" });
        }
        // Kiểm tra xem có người dùng nào trong hệ thống chưa
        const userCount = await User.countDocuments({});
        const role = userCount === 0 ? "admin" : "customer";
        console.log({ username, email, password, role });
        const user = await User.create({ username, email, password, role });
        res.status(StatusCodes.CREATED).json({ message: "Đăng ký thành công" });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Đã xảy ra lỗi trong quá trình đăng ký",
        });
    }
};

// Đăng nhập người dùng
export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Người dùng không tồn tại" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Mật khẩu không đúng" });
        }
        // Tạo token JWT
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(StatusCodes.OK).json({ token });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Đã xảy ra lỗi trong quá trình đăng nhập",
        });
    }
};

// Yêu cầu đặt lại mật khẩu
export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Người dùng không tồn tại" });
        }

        // Tạo token đặt lại mật khẩu
        const token = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 giờ
        await user.save();

        // Tạo client emailjs
        const client = new SMTPClient({
            user: import.meta.env.VITE_EMAIL_USER,
            password: import.meta.env.VITE_EMAIL_PASS,
            host: "smtp.gmail.com",
            ssl: true,
        });

        // Gửi email với token đặt lại mật khẩu
        const message = {
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                   Please click on the following link, or paste this into your browser to complete the process:\n\n
                   http://${req.headers.host}/reset/${token}\n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            from: "passwordreset@yourdomain.com",
            to: user.email,
            subject: "Password Reset",
        };

        client.send(message, (err, message) => {
            if (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
            }
            res.status(StatusCodes.OK).json({ message: "Email đặt lại mật khẩu đã được gửi" });
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// Đặt lại mật khẩu
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn" });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(StatusCodes.OK).json({ message: "Mật khẩu đã được đặt lại thành công" });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};
