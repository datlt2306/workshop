# Các bước thực hiện chức năng đăng ký

1. **Tạo model cho người dùng:**

    - Mở file [models/user.js](be/models/user.js).
    - Định nghĩa schema và model cho người dùng:

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

2. **Tạo controller cho chức năng đăng ký:**

    - Mở file [controllers/auth.js](be/controllers/auth.js).
    - Thêm hàm `register` để xử lý logic đăng ký:

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

3. **Tạo route cho chức năng đăng ký:**

    - Mở file [routes/auth.js](be/routes/auth.js).
    - Thêm route cho chức năng đăng ký:

        ```javascript
        import { Router } from "express";
        import { signup } from "../controllers/auth";

        const router = Router();

        router.post(`/signup`, signup);

        export default router;
        ```

4. **Chạy server và kiểm tra:**
    - Chạy lệnh `npm run dev` để khởi động server.
    - Sử dụng Postman hoặc công cụ tương tự để gửi yêu cầu POST tới endpoint `/api/auth/register` với dữ liệu người dùng để kiểm tra chức năng đăng ký.

# Các bước thực hiện chức năng đăng nhập

1. **Tạo route cho chức năng đăng nhập:**

    - Mở file [routes/auth.js](be/routes/auth.js).
    - Thêm route cho chức năng đăng nhập:

        ```javascript
        import { Router } from "express";
        import { register, login } from "../controllers/auth";

        const router = Router();

        // Route cho chức năng đăng ký
        router.post(`/register`, register);

        // Route cho chức năng đăng nhập
        router.post(`/login`, login);

        export default router;
        ```

2. **Tạo controller cho chức năng đăng nhập:**

    - Mở file [controllers/auth.js](be/controllers/auth.js).
    - Thêm hàm `login` để xử lý logic đăng nhập:

        ```javascript
        import User from "../models/user";
        import jwt from "jsonwebtoken";

        export const login = async (req, res) => {
            try {
                const { email, password } = req.body;

                // Tìm người dùng theo email
                const user = await User.findOne({ email });

                // Nếu không tìm thấy người dùng, trả về lỗi
                if (!user) {
                    return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
                }

                // Kiểm tra mật khẩu
                const isMatch = await user.comparePassword(password);

                // Nếu mật khẩu không đúng, trả về lỗi
                if (!isMatch) {
                    return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
                }

                // Tạo token JWT
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                    expiresIn: "1h",
                });

                // Trả về token và thông tin người dùng
                res.status(200).json({
                    token,
                    user: { id: user._id, email: user.email, role: user.role },
                });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        };
        ```

3. **Cập nhật model người dùng để hỗ trợ kiểm tra mật khẩu:**

    - Mở file [models/user.js](be/models/user.js).
    - Đảm bảo rằng phương thức `comparePassword` đã được định nghĩa:
        ```javascript
        // Phương thức để kiểm tra mật khẩu
        UserSchema.methods.comparePassword = async function (password) {
            // Sử dụng bcrypt để so sánh mật khẩu
            return await bcrypt.compare(password, this.password);
        };
        ```

4. **Cấu hình biến môi trường:**

    - Mở file [.env](be/.env).
    - Thêm biến môi trường cho JWT:
        ```
        JWT_SECRET=your_jwt_secret_key
        ```

5. **Cấu hình môi trường và khởi động server:**

    - Mở file [app.js](be/app.js).
    - Đảm bảo rằng bạn đã cấu hình kết nối tới cơ sở dữ liệu và khởi động server:

        ```javascript
        import express from "express";
        import mongoose from "mongoose";
        import cors from "cors";
        import morgan from "morgan";
        import routes from "./routes";

        const app = express();

        // Middleware
        app.use(cors());
        app.use(express.json());
        app.use(morgan("tiny"));

        // Routes
        app.use("/api", routes);

        // Kết nối tới MongoDB
        mongoose.connect("mongodb://127.0.0.1:27017/workshop");

        export const viteNodeApp = app;
        ```

6. **Chạy server và kiểm tra:**
    - Chạy lệnh `npm start` hoặc `nodemon` để khởi động server.
    - Sử dụng Postman hoặc công cụ tương tự để gửi yêu cầu POST tới endpoint `/api/auth/login` với dữ liệu người dùng để kiểm tra chức năng đăng nhập.

## Ví dụ yêu cầu đăng nhập

Gửi yêu cầu POST tới `http://localhost:5000/api/auth/login` với dữ liệu JSON như sau:

```json
{
    "email": "user@example.com",
    "password": "password123"
}
```
