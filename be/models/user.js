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
            enum: ["guest", "customer", "admin"],
            default: "guest",
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

// Phương thức để kiểm tra mật khẩu
UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Phương thức để tạo token đặt lại mật khẩu
UserSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 phút
    return resetToken;
};

// Tạo chỉ số cho email và username
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

export default mongoose.model("User", UserSchema);
