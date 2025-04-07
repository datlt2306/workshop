import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Sản phẩm là bắt buộc"],
    },
    attributeValues: [
        {
            name: {
                type: String,
                required: true,
            },
            value: {
                type: String,
                required: true,
            },
        },
    ],
    sku: {
        type: String,
        required: [true, "SKU biến thể là bắt buộc"],
        unique: true,
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "Giá biến thể là bắt buộc"],
        min: [0, "Giá biến thể không được âm"],
    },
    discountPrice: {
        type: Number,
        min: [0, "Giá khuyến mãi không được âm"],
    },
    stock: {
        type: Number,
        required: [true, "Số lượng tồn kho là bắt buộc"],
        min: [0, "Số lượng tồn kho không được âm"],
        default: 0,
    },
    images: [String],
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
});

// Tạo index cho tìm kiếm nhanh
productVariantSchema.index({ product: 1 });
productVariantSchema.index({ sku: 1 });

// Đảm bảo kết hợp thuộc tính là duy nhất cho mỗi sản phẩm
productVariantSchema.index(
    { product: 1, "attributeValues.name": 1, "attributeValues.value": 1 },
    { unique: true }
);

export const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);
