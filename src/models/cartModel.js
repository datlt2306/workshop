import mongoose from "mongoose"

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
    variant: {
      type: mongoose.Schema.ObjectId,
      ref: "ProductVariant",
    },
    quantity: {
      type: Number,
      required: [true, "Vui lòng chỉ định số lượng"],
      min: [1, "Số lượng phải từ 1 trở lên"],
    },
    price: {
      type: Number,
      required: [true, "Giá phải được xác định"],
    },
  },
  {
    _id: false,
  },
)

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Giỏ hàng phải thuộc về một người dùng"],
    },
    items: [cartItemSchema],
    voucher: {
      type: mongoose.Schema.ObjectId,
      ref: "Voucher",
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    subtotal: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
cartSchema.index({ user: 1 })

// Populate sản phẩm và biến thể
cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "items.product",
    select: "name price images",
  })
    .populate({
      path: "items.variant",
      select: "name price images attributes",
    })
    .populate({
      path: "voucher",
      select: "code discount",
    })

  next()
})

// Method để cập nhật thông tin tổng
cartSchema.methods.updateCartTotals = function () {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0)
  this.subtotal = this.items.reduce((total, item) => total + item.price * item.quantity, 0)
  this.total = this.subtotal - this.discount

  return this.save()
}

export const Cart = mongoose.model("Cart", cartSchema)

