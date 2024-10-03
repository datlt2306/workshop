import mongoose, { version } from "mongoose";

const ProductSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        stock: Boolean,
        description: String,
        imageUrl: String,
    },
    { timestamps: true, versionKey: false }
);
export default mongoose.model("Product", ProductSchema);
