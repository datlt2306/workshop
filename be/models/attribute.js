import mongoose from "mongoose";

const varriantSchema = new mongoose.Schema({
    varriant_name: {
        type: String,
        required: true,
    },
    varriant_value: {
        type: String,
        required: true,
    },
    varriant_image: {
        type: String,
        default: "",
    },
    varriant_regular_price: {
        type: Number,
        default: 0,
    },
    varriant_sale_price: {
        type: Number,
        default: 0,
    },
    varriant_quantity: {
        type: Number,
        default: 0,
    },
    varriant_stock_status: {
        type: String,
        enum: ["in_stock", "out_of_stock"],
        default: "in_stock",
    },
    varriant_description: {
        type: String,
        default: "",
    },
});

export const attributeSchema = new mongoose.Schema(
    {
        attribute_name: {
            type: String,
            required: true,
        },
        attribute_value: {
            type: [varriantSchema],
            required: true,
        },
        attribute_type: {
            type: String,
            required: true,
        },
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model("Attribute", attributeSchema);

// attribute
// color
// yellow: quantity, regular_price, image,stock_status, quantity, sale_price

// red
// size
