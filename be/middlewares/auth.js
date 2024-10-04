import jwt from "jsonwebtoken";
import User from "../models/user";

const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Không có token, quyền truy cập bị từ chối" });
    }

    try {
        const decoded = jwt.verify(token, import.meta.env.VITE_JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        // Kiểm tra trạng thái tài khoản
        if (!user.status) {
            return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token không hợp lệ" });
    }
};

const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Không có quyền truy cập" });
        }

        const { role } = req.user;
        if (role !== requiredRole) {
            return res.status(403).json({ message: "Không có quyền truy cập" });
        }

        next();
    };
};

const multiRoleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Không có quyền truy cập" });
        }

        const { role } = req.user;
        if (!allowedRoles.includes(role)) {
            return res.status(403).json({ message: "Không có quyền truy cập" });
        }

        next();
    };
};

export { authMiddleware, roleMiddleware, multiRoleMiddleware };
