import { Router } from "express";
import { addProduct, getProducts } from "../controllers/product";

const router = Router();

router.get("/products", getProducts);
router.post("/products", addProduct);
export default router;
