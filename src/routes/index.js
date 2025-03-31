import express from "express"
import { authRouter } from "./authRoutes"
import { userRouter } from "./userRoutes"
import productRouter from "./productRoutes"
import { attributeRouter } from "./attributeRoutes"
import { orderRouter } from "./orderRoutes"
import { cartRouter } from "./cartRoutes"
import { reportRouter } from "./reportRoutes"
import { categoryRouter } from "./categoryRoutes"
import { notificationRouter } from "./notificationRoutes"
import voucherRouter from "./voucherRoutes"

export const apiRouter = express.Router()

// Đăng ký các router
apiRouter.use("/auth", authRouter)
apiRouter.use("/users", userRouter)
apiRouter.use("/products", productRouter)
apiRouter.use("/categories", categoryRouter)
apiRouter.use("/attributes", attributeRouter)
apiRouter.use("/orders", orderRouter)
apiRouter.use("/cart", cartRouter)
apiRouter.use("/vouchers", voucherRouter)
apiRouter.use("/reports", reportRouter)
apiRouter.use("/notifications", notificationRouter)

// Route mặc định
apiRouter.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API hoạt động tốt!",
  })
})

