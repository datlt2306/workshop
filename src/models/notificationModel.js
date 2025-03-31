import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Thông báo phải có người nhận"],
    },
    type: {
      type: String,
      enum: ["order_created", "order_status_changed", "payment_received", "system", "other"],
      required: [true, "Thông báo phải có loại"],
    },
    title: {
      type: String,
      required: [true, "Thông báo phải có tiêu đề"],
    },
    message: {
      type: String,
      required: [true, "Thông báo phải có nội dung"],
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: String,
  },
  {
    timestamps: true,
  },
)

// Plugins
notificationSchema.plugin(mongoosePaginate)

// Indexes
notificationSchema.index({ recipient: 1, createdAt: -1 })
notificationSchema.index({ isRead: 1 })

export const Notification = mongoose.model("Notification", notificationSchema)

