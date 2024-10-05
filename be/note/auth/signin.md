# Các bước thực hiện chức năng đăng nhập

## Bước 1: Tạo route cho chức năng đăng nhập:

-   Mở file [routes/auth.js](../../routes/auth.js).
-   Thêm route cho chức năng đăng nhập:

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

## Bước 2: Tạo controller cho chức năng đăng nhập:

-   Mở file [controllers/auth.js](../../controllers/auth.js).
-   Thêm hàm `login` để xử lý logic đăng nhập:

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

## Bước 3: Cập nhật model người dùng để hỗ trợ kiểm tra mật khẩu:

-   Mở file [models/user.js](../../models/user.js).
-   Đảm bảo rằng phương thức `comparePassword` đã được định nghĩa:

    ```javascript
    // Phương thức để kiểm tra mật khẩu
    UserSchema.methods.comparePassword = async function (password) {
        // Sử dụng bcrypt để so sánh mật khẩu
        return await bcrypt.compare(password, this.password);
    };
    ```

## Bước 4: Cấu hình biến môi trường:

-   Mở file [.env](../../.env).
-   Thêm biến môi trường cho JWT:

```
JWT_SECRET=your_jwt_secret_key
```

## Bước 5: Chạy server và kiểm tra:

-   Chạy lệnh `npm dev` để khởi động server.
-   Sử dụng Postman hoặc công cụ tương tự để gửi yêu cầu POST tới endpoint `/api/auth/login` với dữ liệu người dùng để kiểm tra chức năng đăng nhập.

### Ví dụ yêu cầu đăng nhập

Gửi yêu cầu POST tới `http://localhost:5000/api/auth/login` với dữ liệu JSON như sau:

```json
{
    "email": "user@example.com",
    "password": "password123"
}
```
