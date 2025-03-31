import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import mongoosePaginate from "mongoose-paginate-v2"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vui lòng cung cấp tên"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Vui lòng cung cấp email"],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Vui lòng cung cấp địa chỉ email hợp lệ"],
    },
    password: {
      type: String,
      required: [true, "Vui lòng cung cấp mật khẩu"],
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
      select: false, // Không trả về password trong query
    },
    passwordChangedAt: Date,
    role: {
      type: String,
      enum: ["customer", "staff", "admin"],
      default: "customer",
    },
    phone: {
      type: String,
      validate: {
        validator: (v) => /^\d{10}$/.test(v),
        message: (props) => `${props.value} không phải là số điện thoại hợp lệ!`,
      },
    },
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    avatar: String,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Plugin cho pagination
userSchema.plugin(mongoosePaginate)

// Indexes
userSchema.index({ email: 1 })

// Middleware trước khi lưu
userSchema.pre("save", async function (next) {
  // Chỉ hash password nếu password được sửa đổi
  if (!this.isModified("password")) return next()

  // Hash password với cost factor 12
  this.password = await bcrypt.hash(this.password, 12)

  next()
})

// Middleware để cập nhật passwordChangedAt khi thay đổi mật khẩu
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next()

  this.passwordChangedAt = Date.now() - 1000 // -1s để đảm bảo token được tạo sau khi password thay đổi
  next()
})

// Tự động lọc các user không active
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } })
  next()
})

// Method kiểm tra password
userSchema.methods.correctPassword = async (candidatePassword, userPassword) =>
  await bcrypt.compare(candidatePassword, userPassword)

// Method kiểm tra password có thay đổi sau khi token được tạo
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Number.parseInt(this.passwordChangedAt.getTime() / 1000, 10)

    return JWTTimestamp < changedTimestamp
  }

  // False means NOT changed
  return false
}

export const User = mongoose.model("User", userSchema)

