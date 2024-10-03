import mongoose from "mongoose";

const ProductSchema = mongoose.Schema(
    {
        name: String,
        price: Number,
        stock: Number,
        description: String,
        imageUrl: String,
    },
    { timestamps: true }
);
export default mongoose.model("Product", ProductSchema);
