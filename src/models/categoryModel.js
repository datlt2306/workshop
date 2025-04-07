import mongoose from "mongoose";
import slugify from "slugify";
import mongoosePaginate from "mongoose-paginate-v2";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Danh mục phải có tên"],
            unique: true,
            trim: true,
        },
        slug: String,
        description: {
            type: String,
            trim: true,
        },
        parent: {
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            default: null,
        },
        level: {
            type: Number,
            default: 1,
        },
        image: String,
        isActive: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Plugins
categorySchema.plugin(mongoosePaginate);

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });

// Virtual field cho các danh mục con
categorySchema.virtual("children", {
    ref: "Category",
    localField: "_id",
    foreignField: "parent",
});

// Virtual field cho sản phẩm thuộc danh mục
categorySchema.virtual("products", {
    ref: "Product",
    localField: "_id",
    foreignField: "category",
});

// Document middleware: tự động tạo slug
categorySchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// Query middleware: tự động loại bỏ các danh mục không kích hoạt
categorySchema.pre(/^find/, function (next) {
    this.find({ isActive: { $ne: false } });
    next();
});

// Populate danh mục cha
categorySchema.pre(/^find/, function (next) {
    this.populate({
        path: "parent",
        select: "name",
    });

    next();
});

export const Category = mongoose.model("Category", categorySchema);
