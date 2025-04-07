import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const attributeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Thuộc tính phải có tên"],
            unique: true,
            trim: true,
        },
        code: {
            type: String,
            required: [true, "Thuộc tính phải có mã"],
            unique: true,
            trim: true,
        },
        description: String,
        values: [String],
        type: {
            type: String,
            enum: ["select", "checkbox", "radio", "color", "size"],
            default: "select",
        },
        isRequired: {
            type: Boolean,
            default: false,
        },
        isFilterable: {
            type: Boolean,
            default: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Plugins
attributeSchema.plugin(mongoosePaginate);

// Indexes
attributeSchema.index({ code: 1 });

// Query middleware
attributeSchema.pre(/^find/, function (next) {
    this.find({ isActive: { $ne: false } });
    next();
});

export const Attribute = mongoose.model("Attribute", attributeSchema);
