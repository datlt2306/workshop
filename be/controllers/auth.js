import User from "../models/user";
import jwt from "jsonwebtoken";
import logger from "../utils/logger"; // Giả sử bạn có một module logger

// Đăng ký người dùng mới
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Kiểm tra xem email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã được sử dụng" });
        }

        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: "Đăng ký thành công" });
    } catch (error) {
        logger.error("Error during registration: ", error);
        res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình đăng ký" });
    }
};

// Đăng nhập người dùng
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không đúng" });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, "your_jwt_secret", {
            expiresIn: "1h",
        });
        res.status(200).json({ token });
    } catch (error) {
        logger.error("Error during login: ", error);
        res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình đăng nhập" });
    }
};

// Lấy thông tin người dùng hiện tại
export const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Không có quyền truy cập" });
        }

        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }
        res.status(200).json(user);
    } catch (error) {
        logger.error("Error fetching current user: ", error);
        res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình lấy thông tin người dùng" });
    }
};
