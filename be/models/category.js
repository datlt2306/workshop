import mongoose from "mongoose";
const CategorySchema = new mongoose.Schema({
    category_title: {
        type: String,
        required: true,
        minlength: 3,
    },
    category_status: {
        type: Boolean,
        default: true,
    },
});

export default mongoose.model("Category", CategorySchema);
