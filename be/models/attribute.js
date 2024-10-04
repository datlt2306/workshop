import mongoose from "mongoose";

const varriantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "",
    },
    regular_price: {
        type: Number,
        default: 0,
    },
    sale_price: {
        type: Number,
        default: 0,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    stock_status: {
        type: String,
        enum: ["in_stock", "out_of_stock"],
        default: "in_stock",
    },
    description: {
        type: String,
        default: "",
    },
});

export const attributeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        value: {
            type: [varriantSchema],
            required: true,
        },
        type: {
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
