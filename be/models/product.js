import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import slugify from "slugify";

const ProductSchema = new mongoose.Schema(
    {
        product_name: {
            type: String,
            required: true,
            minlength: 3,
            unique: true, // Đảm bảo tính duy nhất
        },
        slug: {
            type: String,
            unique: true,
        },
        product_price: {
            type: Number,
            required: true,
        },
        product_image_url: {
            type: String,
            required: true,
        },
        product_attributes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Attribute",
                required: true,
            },
        ],
        product_quantity: {
            type: Number,
            default: 1,
        },
        product_description: {
            type: String,
        },
        product_rating: {
            type: Number,
            min: 0,
            max: 5,
        },
        product_reviews: {
            type: Number,
            default: 0,
        },
        product_category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        product_tags: [String],
        product_sku: {
            type: String,
            required: true,
        },
        product_status: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true, versionKey: false }
);

// Middleware để tự động tạo slug từ tên sản phẩm
ProductSchema.pre("save", function (next) {
    if (this.isModified("product_name")) {
        this.slug = slugify(this.product_name, { lower: true, strict: true });
    }
    next();
});

ProductSchema.plugin(mongoosePaginate);

export default mongoose.model("Product", ProductSchema);
