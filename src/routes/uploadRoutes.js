import express from "express";
import { verifyJWT, restrictTo } from "../middleware/auth";
import {
    uploadSingleImage,
    uploadMultipleImages,
    updateImage,
    deleteImage,
    deleteMultipleImages,
} from "../controllers/uploadController";
import { uploadSingle, uploadMultiple } from "../middleware/uploadMiddleware";

const router = express.Router();

// Tất cả các routes yêu cầu xác thực
router.use(verifyJWT);

// Chỉ admin và staff có quyền quản lý ảnh
router.use(restrictTo("admin", "staff"));

// Upload 1 ảnh
router.post("/", uploadSingle("image"), uploadSingleImage);

// Upload nhiều ảnh
router.post("/multiple", uploadMultiple("images", 10), uploadMultipleImages);

// Cập nhật ảnh
router.put("/:publicId", uploadSingle("image"), updateImage);

// Xóa ảnh
router.delete("/:publicId", deleteImage);

// Xóa nhiều ảnh
router.delete("/", deleteMultipleImages);

export default router;

/**
 * @swagger
 * tags:
 *   name: Images
 *   description: API endpoints quản lý hình ảnh
 */

/**
 * @swagger
 * /uploads:
 *   post:
 *     summary: Upload một hình ảnh
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     parameters:
 *       - in: query
 *         name: folder
 *         schema:
 *           type: string
 *         description: Thư mục trên Cloudinary (mặc định là 'products')
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     public_id:
 *                       type: string
 *                     url:
 *                       type: string
 *                     width:
 *                       type: number
 *                     height:
 *                       type: number
 *                     format:
 *                       type: string
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *       401:
 *         description: Không được phép truy cập
 *
 * /uploads/multiple:
 *   post:
 *     summary: Upload nhiều hình ảnh
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     parameters:
 *       - in: query
 *         name: folder
 *         schema:
 *           type: string
 *         description: Thư mục trên Cloudinary (mặc định là 'products')
 *     responses:
 *       200:
 *         description: Thành công
 *
 * /uploads/{publicId}:
 *   put:
 *     summary: Cập nhật một hình ảnh
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: publicId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Thành công
 *
 *   delete:
 *     summary: Xóa một hình ảnh
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: publicId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 *
 * /uploads:
 *   delete:
 *     summary: Xóa nhiều hình ảnh
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - publicIds
 *             properties:
 *               publicIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
