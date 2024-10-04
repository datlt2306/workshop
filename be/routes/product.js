import { Router } from "express";
import { createProduct, getProductById, getProducts } from "../controllers/product";

const router = Router();

router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.post("/products", createProduct);
export default router;
