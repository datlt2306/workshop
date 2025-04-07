import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Plugin hệ thống cho tất cả các schema
const registerGlobalPlugins = () => {
    // Plugin phân trang
    mongoose.plugin(mongoosePaginate);

    // Plugin timestamps tùy chỉnh
    mongoose.plugin((schema) => {
        // bỏ versionKey
        schema.set("versionKey", false);
        schema.add({
            createdAt: {
                type: Date,
                default: Date.now,
            },
            updatedAt: {
                type: Date,
                default: Date.now,
            },
        });

        schema.pre("save", function (next) {
            if (this.isModified()) {
                this.updatedAt = new Date();
            }
            next();
        });
    });
};

// Đăng ký tất cả plugins ngay khi file được import
registerGlobalPlugins();

export default registerGlobalPlugins;
