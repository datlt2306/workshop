import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const CategorySchema = new mongoose.Schema(
    {
        category_title: {
            type: String,
            required: true,
            minlength: 3,
            unique: true,
        },
        category_status: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true, versionKey: false }
);
CategorySchema.plugin(mongoosePaginate);

export default mongoose.model("Category", CategorySchema);
