import express from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import productRoutes from "./productRoutes";
import categoryRoutes from "./categoryRoutes";
import { cartRouter } from "./cartRoutes";
import orderRoutes from "./orderRoutes";
import voucherRoutes from "./voucherRoutes";
import notificationRoutes from "./notificationRoutes";
import attributeRoutes from "./attributeRoutes";
import reportRoutes from "./reportRoutes";
import uploadRoutes from "./uploadRoutes";

const router = express.Router();

// API Routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/cart", cartRouter);
router.use("/orders", orderRoutes);
router.use("/vouchers", voucherRoutes);
router.use("/notifications", notificationRoutes);
router.use("/attributes", attributeRoutes);
router.use("/reports", reportRoutes);
router.use("/uploads", uploadRoutes);

export default router;
