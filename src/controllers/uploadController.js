import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/appError";
import * as cloudinaryService from "../services/cloudinaryService";
import fs from "fs";

/**
 * Upload một file ảnh lên Cloudinary
 */
export const uploadSingleImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new AppError("Không tìm thấy file cần upload", StatusCodes.BAD_REQUEST);
    }

    const { folder = "products" } = req.query;

    try {
        // Upload ảnh lên Cloudinary
        const result = await cloudinaryService.uploadImage(req.file.path, { folder });

        res.status(StatusCodes.OK).json({
            success: true,
            data: result,
        });
    } catch (error) {
        // Đảm bảo xóa file tạm nếu xảy ra lỗi
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        throw new AppError(`Lỗi upload ảnh: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

/**
 * Upload nhiều file ảnh lên Cloudinary
 */
export const uploadMultipleImages = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        throw new AppError("Không tìm thấy file cần upload", StatusCodes.BAD_REQUEST);
    }

    const { folder = "products" } = req.query;
    const filePaths = req.files.map((file) => file.path);

    try {
        // Upload nhiều ảnh lên Cloudinary
        const results = await cloudinaryService.uploadMultipleImages(filePaths, { folder });

        res.status(StatusCodes.OK).json({
            success: true,
            data: results,
        });
    } catch (error) {
        // Đảm bảo xóa các file tạm nếu xảy ra lỗi
        if (req.files) {
            req.files.forEach((file) => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }

        throw new AppError(
            `Lỗi upload nhiều ảnh: ${error.message}`,
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
});

/**
 * Cập nhật một ảnh trên Cloudinary
 */
export const updateImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new AppError("Không tìm thấy file cần upload", StatusCodes.BAD_REQUEST);
    }

    const { publicId } = req.params;
    const { folder } = req.query;

    try {
        // Cập nhật ảnh trên Cloudinary
        const result = await cloudinaryService.updateImage(publicId, req.file.path, { folder });

        res.status(StatusCodes.OK).json({
            success: true,
            data: result,
        });
    } catch (error) {
        // Đảm bảo xóa file tạm nếu xảy ra lỗi
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        throw new AppError(`Lỗi cập nhật ảnh: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

/**
 * Xóa một ảnh trên Cloudinary
 */
export const deleteImage = asyncHandler(async (req, res) => {
    const { publicId } = req.params;

    // Xóa ảnh trên Cloudinary
    const result = await cloudinaryService.deleteImage(publicId);

    if (result.result !== "ok") {
        throw new AppError("Không thể xóa ảnh này", StatusCodes.BAD_REQUEST);
    }

    res.status(StatusCodes.OK).json({
        success: true,
        message: "Xóa ảnh thành công",
        data: result,
    });
});

/**
 * Xóa nhiều ảnh trên Cloudinary
 */
export const deleteMultipleImages = asyncHandler(async (req, res) => {
    const { publicIds } = req.body;

    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
        throw new AppError("Vui lòng cung cấp danh sách public_id hợp lệ", StatusCodes.BAD_REQUEST);
    }

    // Xóa nhiều ảnh trên Cloudinary
    const result = await cloudinaryService.deleteMultipleImages(publicIds);

    res.status(StatusCodes.OK).json({
        success: true,
        message: "Xóa ảnh thành công",
        data: result,
    });
});
