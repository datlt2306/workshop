import { Router } from "express";
import {
    getCartByUserId,
    addItemToCart,
    increaseProductQuantity,
    decreaseProductQuantity,
    removeItemFromCart,
} from "../controllers/cart";

const router = Router();

// Route để lấy giỏ hàng của người dùng
router.get("/cart/:userId", getCartByUserId);

// Route để thêm sản phẩm vào giỏ hàng
router.post("/cart", addItemToCart);

// Route để tăng số lượng sản phẩm trong giỏ hàng
router.put("/cart/increase", increaseProductQuantity);

// Route để giảm số lượng sản phẩm trong giỏ hàng
router.put("/cart/decrease", decreaseProductQuantity);

// Route để xóa sản phẩm khỏi giỏ hàng
router.delete("/cart", removeItemFromCart);

export default router;
