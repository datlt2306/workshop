import express from "express"
import {
  getSalesReport,
  getProductsReport,
  getCustomersReport,
  getOrdersReport,
  getDashboardStats,
} from "../controllers/reportController"
import { verifyJWT, restrictTo } from "../middleware/auth"

export const reportRouter = express.Router()

// Tất cả các route đều yêu cầu đăng nhập và quyền admin hoặc staff
reportRouter.use(verifyJWT)
reportRouter.use(restrictTo("admin", "staff"))

// Báo cáo doanh số
reportRouter.get("/sales", getSalesReport)
reportRouter.get("/sales/total", getSalesReport)
reportRouter.get("/sales/by-period", getSalesReport)

// Báo cáo sản phẩm
reportRouter.get("/products", getProductsReport)
reportRouter.get("/products/top", getProductsReport)
reportRouter.get("/products/inventory", getProductsReport)

// Báo cáo khách hàng
reportRouter.get("/customers", getCustomersReport)
reportRouter.get("/customers/top", getCustomersReport)
reportRouter.get("/customers/new", getCustomersReport)

// Báo cáo đơn hàng
reportRouter.get("/orders", getOrdersReport)
reportRouter.get("/orders/stats", getOrdersReport)
reportRouter.get("/orders/by-status", getOrdersReport)

// Thống kê tổng quan cho dashboard
reportRouter.get("/dashboard", getDashboardStats)

