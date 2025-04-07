import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: true,
        },
        variant: {
            type: mongoose.Schema.ObjectId,
            ref: "ProductVariant",
        },
        name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, "Số lượng phải từ 1 trở lên"],
        },
        price: {
            type: Number,
            required: true,
        },
        attributes: [
            {
                name: String,
                value: String,
            },
        ],
    },
    {
        _id: false,
    }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        orderNumber: {
            type: String,
            unique: true,
        },
        items: [orderItemSchema],
        status: {
            type: String,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        shippingAddress: {
            fullName: String,
            street: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
            phone: String,
        },
        paymentMethod: {
            type: String,
            enum: ["cod", "card", "banking"],
            default: "cod",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
        subtotal: {
            type: Number,
            required: true,
        },
        tax: {
            type: Number,
            default: 0,
        },
        shippingFee: {
            type: Number,
            default: 0,
        },
        discount: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            required: true,
        },
        voucher: {
            type: mongoose.Schema.ObjectId,
            ref: "Voucher",
        },
        notes: String,
        cancelReason: String,
        trackingNumber: String,
    },
    {
        timestamps: true,
    }
);

// Plugins
orderSchema.plugin(mongoosePaginate);

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });

// Tự động tạo mã đơn hàng trước khi lưu
orderSchema.pre("save", async function (next) {
    if (this.isNew) {
        const date = new Date();
        const year = date.getFullYear().toString().substr(-2);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        // Đếm số lượng đơn hàng trong ngày
        const count = await this.constructor.countDocuments({
            createdAt: {
                $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
            },
        });

        // Format: ORD-YYMMDD-XXXX (X là số thứ tự)
        this.orderNumber = `ORD-${year}${month}${day}-${String(count + 1).padStart(4, "0")}`;
    }

    next();
});

// Populate user và voucher
orderSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "name email",
    }).populate({
        path: "voucher",
        select: "code discount",
    });

    next();
});

export const Order = mongoose.model("Order", orderSchema);
