import express from "express";
import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategoryById,
    updateCategory,
} from "../controllers/category";
import { authMiddleware, roleMiddleware } from "../middlewares/auth";

const router = express.Router();

// Middleware kết hợp
const adminMiddleware = [authMiddleware, roleMiddleware("admin")];

// Định nghĩa các route cho Category
router.post("/categories", adminMiddleware, createCategory);
router.get("/categories", getCategories);
router.get("/categories/:id", getCategoryById);
router.put("/categories/:id", adminMiddleware, updateCategory);
router.delete("/categories/:id", adminMiddleware, deleteCategory);

export default router;
