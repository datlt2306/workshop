import { Router } from "express";
import {
    createProduct,
    getProductById,
    getProducts,
    updateProduct,
    deleteProduct,
} from "../controllers/product";

const router = Router();

// Route để lấy danh sách sản phẩm
router.get("/products", getProducts);

// Route để lấy thông tin chi tiết của một sản phẩm theo ID
router.get("/products/:id", getProductById);

// Route để thêm một sản phẩm mới
router.post("/products", createProduct);

// Route để cập nhật thông tin một sản phẩm theo ID
router.put("/products/:id", updateProduct);

// Route để xóa một sản phẩm theo ID
router.delete("/products/:id", deleteProduct);

export default router;
