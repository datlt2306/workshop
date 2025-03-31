import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const voucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Voucher phải có mã"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },
    amount: {
      type: Number,
      required: [true, "Voucher phải có giá trị giảm giá"],
    },
    minAmount: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, "Voucher phải có ngày hết hạn"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    maxUses: {
      type: Number,
      default: 0, // 0 = không giới hạn
    },
    usesCount: {
      type: Number,
      default: 0,
    },
    maxUsesPerUser: {
      type: Number,
      default: 1,
    },
    usedBy: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        usedAt: {
          type: Date,
          default: Date.now,
        },
        count: {
          type: Number,
          default: 1,
        },
      },
    ],
    categories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
      },
    ],
    products: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    description: String,
  },
  {
    timestamps: true,
  },
)

// Plugins
voucherSchema.plugin(mongoosePaginate)

// Indexes
voucherSchema.index({ code: 1 })
voucherSchema.index({ startDate: 1, endDate: 1 })
voucherSchema.index({ isActive: 1 })

// Query middleware
voucherSchema.pre(/^find/, function (next) {
  // Lọc các voucher đã hết hạn hoặc không kích hoạt
  this.find({
    isActive: true,
    startDate: { $lte: Date.now() },
    endDate: { $gte: Date.now() },
  })

  next()
})

// Kiểm tra voucher còn hạn sử dụng
voucherSchema.methods.isValid = function () {
  const now = new Date()

  if (!this.isActive) return false
  if (now < this.startDate || now > this.endDate) return false
  if (this.maxUses > 0 && this.usesCount >= this.maxUses) return false

  return true
}

// Kiểm tra user đã sử dụng voucher quá số lần cho phép chưa
voucherSchema.methods.isValidForUser = function (userId) {
  if (!this.isValid()) return false

  const userUsage = this.usedBy.find((item) => item.user.toString() === userId.toString())

  if (userUsage && this.maxUsesPerUser > 0 && userUsage.count >= this.maxUsesPerUser) {
    return false
  }

  return true
}

// Tính toán giá trị giảm giá
voucherSchema.methods.calculateDiscount = function (subtotal) {
  if (subtotal < this.minAmount) return 0

  if (this.type === "percentage") {
    return (subtotal * this.amount) / 100
  }

  return this.amount // fixed amount
}

export const Voucher = mongoose.model("Voucher", voucherSchema)

