# Các bước thực hiện chức năng đăng ký

## Bước 1: Tạo model cho người dùng:

-   Mở file [models/user.js](../../models/user.js).

-   Định nghĩa schema và model cho người dùng:

```javascript
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            minlength: 3,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [validator.isEmail, "Please fill a valid email address"],
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer",
        },
        status: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpires: {
            type: Date,
        },
    },
    { timestamps: true, versionKey: false }
);

// Middleware để mã hóa mật khẩu trước khi lưu
UserSchema.pre("save", async function (next) {
    if (this.isModified("password") || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

export default mongoose.model("User", UserSchema);
```

## Bước 2: Tạo controller cho chức năng đăng ký:

-   Mở file [controllers/auth.js](../../controllers/auth.js).
-   Thêm hàm `register` để xử lý logic đăng ký:

```javascript
import User from "../models/user";

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã được sử dụng" });
        }
        // Kiểm tra xem có người dùng nào trong hệ thống chưa
        const userCount = await User.countDocuments({});
        // Nếu không có người dùng nào, đặt vai trò là admin, ngược lại là customer
        const role = userCount === 0 ? "admin" : "customer";
        // Tạo người dùng mới
        const user = await User.create({ username, email, password, role });
        res.status(201).json({ message: "Đăng ký thành công" });
    } catch (error) {
        res.status(500).json({ error: "Registration failed" });
    }
};
```

## Bước 3: Tạo route cho chức năng đăng ký:

-   Mở file [routes/auth.js](../../routes/auth.js).
-   Thêm route cho chức năng đăng ký:

    ```javascript
    import { Router } from "express";
    import { signup } from "../controllers/auth";

    const router = Router();

    router.post(`/signup`, signup);

    export default router;
    ```

## Bước 4: Chạy server và kiểm tra:

-   Chạy lệnh `npm run dev` để khởi động server.
-   Sử dụng Postman hoặc công cụ tương tự để gửi yêu cầu POST tới endpoint `/api/signup` với dữ liệu người dùng để kiểm tra chức năng đăng ký.

### Ví dụ yêu cầu đăng nhập

Gửi yêu cầu POST tới `http://localhost:3000/api/signup` với dữ liệu JSON như sau:

```json
{
    "username": "user",
    "email": "user@example.com",
    "password": "password123"
}
```
