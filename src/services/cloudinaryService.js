import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload ảnh lên Cloudinary
 * @param {string} filePath - Đường dẫn tới file ảnh cần upload
 * @param {Object} options - Tùy chọn upload (folder, public_id, ...)
 * @returns {Promise<Object>} - Thông tin ảnh đã upload
 */
export const uploadImage = async (filePath, options = {}) => {
    try {
        // Mặc định upload vào folder products nếu không có folder được chỉ định
        const folder = options.folder || "products";

        // Thực hiện upload lên Cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            ...options,
            resource_type: "image",
        });

        // Xóa file tạm sau khi upload thành công
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return {
            public_id: result.public_id,
            url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            resource_type: result.resource_type,
        };
    } catch (error) {
        // Xóa file tạm trong trường hợp upload thất bại
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        throw new Error(`Lỗi khi upload ảnh: ${error.message}`);
    }
};

/**
 * Upload nhiều ảnh lên Cloudinary
 * @param {Array<string>} filePaths - Mảng đường dẫn tới các file ảnh cần upload
 * @param {Object} options - Tùy chọn upload (folder, public_id, ...)
 * @returns {Promise<Array<Object>>} - Thông tin các ảnh đã upload
 */
export const uploadMultipleImages = async (filePaths, options = {}) => {
    try {
        const uploadPromises = filePaths.map((filePath) => uploadImage(filePath, options));
        return await Promise.all(uploadPromises);
    } catch (error) {
        throw new Error(`Lỗi khi upload nhiều ảnh: ${error.message}`);
    }
};

/**
 * Cập nhật ảnh trên Cloudinary
 * @param {string} publicId - ID công khai của ảnh cần cập nhật
 * @param {string} filePath - Đường dẫn tới file ảnh mới
 * @param {Object} options - Tùy chọn upload (folder, ...)
 * @returns {Promise<Object>} - Thông tin ảnh đã cập nhật
 */
export const updateImage = async (publicId, filePath, options = {}) => {
    try {
        // Xóa ảnh cũ
        await cloudinary.uploader.destroy(publicId);

        // Upload ảnh mới với public_id cũ
        const result = await cloudinary.uploader.upload(filePath, {
            public_id: publicId,
            ...options,
            resource_type: "image",
        });

        // Xóa file tạm sau khi upload thành công
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return {
            public_id: result.public_id,
            url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            resource_type: result.resource_type,
        };
    } catch (error) {
        // Xóa file tạm trong trường hợp upload thất bại
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        throw new Error(`Lỗi khi cập nhật ảnh: ${error.message}`);
    }
};

/**
 * Xóa ảnh trên Cloudinary
 * @param {string} publicId - ID công khai của ảnh cần xóa
 * @returns {Promise<Object>} - Kết quả xóa ảnh
 */
export const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return {
            public_id: publicId,
            result: result.result, // "ok" hoặc "not found"
        };
    } catch (error) {
        throw new Error(`Lỗi khi xóa ảnh: ${error.message}`);
    }
};

/**
 * Xóa nhiều ảnh trên Cloudinary
 * @param {Array<string>} publicIds - Mảng các ID công khai của ảnh cần xóa
 * @returns {Promise<Array<Object>>} - Kết quả xóa ảnh
 */
export const deleteMultipleImages = async (publicIds) => {
    try {
        const result = await cloudinary.api.delete_resources(publicIds);
        return {
            deleted: result.deleted,
            partial: result.partial,
            failed: result.failed,
        };
    } catch (error) {
        throw new Error(`Lỗi khi xóa nhiều ảnh: ${error.message}`);
    }
};

/**
 * Tạo URL của ảnh với các transformations
 * @param {string} publicId - ID công khai của ảnh
 * @param {Object} options - Tùy chọn transformations
 * @returns {string} - URL đã được biến đổi
 */
export const getImageUrl = (publicId, options = {}) => {
    return cloudinary.url(publicId, options);
};
