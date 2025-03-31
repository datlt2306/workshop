import { Order } from "../models/orderModel"
import { User } from "../models/userModel"
import { asyncHandler } from "../utils/asyncHandler"

// Báo cáo doanh số
export const getSalesReport = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, period = "day" } = req.query

  // Xây dựng điều kiện thời gian
  const timeFilter = {}
  if (startDate) {
    timeFilter.createdAt = { $gte: new Date(startDate) }
  }
  if (endDate) {
    timeFilter.createdAt = { ...timeFilter.createdAt, $lte: new Date(endDate) }
  }

  // Mặc định lấy dữ liệu 30 ngày gần nhất nếu không có startDate
  if (!startDate && !endDate) {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    timeFilter.createdAt = { $gte: thirtyDaysAgo }
  }

  // Chỉ tính các đơn hàng đã hoàn thành hoặc đang xử lý
  const statusFilter = {
    status: { $in: ["processing", "shipped", "delivered"] },
  }

  // Kết hợp các điều kiện
  const filter = { ...timeFilter, ...statusFilter }

  // Nếu là báo cáo tổng
  if (req.path === "/sales/total") {
    const totalSales = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
    ])

    return res.status(200).json({
      success: true,
      data: {
        total: totalSales.length > 0 ? totalSales[0].total : 0,
        count: totalSales.length > 0 ? totalSales[0].count : 0,
      },
    })
  }

  // Báo cáo theo khoảng thời gian
  if (req.path === "/sales/by-period") {
    let dateFormat
    let groupBy

    switch (period) {
      case "day":
        dateFormat = "%Y-%m-%d"
        groupBy = { $dateToString: { format: dateFormat, date: "$createdAt" } }
        break
      case "week":
        groupBy = {
          $concat: [{ $toString: { $year: "$createdAt" } }, "-W", { $toString: { $week: "$createdAt" } }],
        }
        break
      case "month":
        dateFormat = "%Y-%m"
        groupBy = { $dateToString: { format: dateFormat, date: "$createdAt" } }
        break
      case "year":
        dateFormat = "%Y"
        groupBy = { $dateToString: { format: dateFormat, date: "$createdAt" } }
        break
      default:
        dateFormat = "%Y-%m-%d"
        groupBy = { $dateToString: { format: dateFormat, date: "$createdAt" } }
    }

    const salesByPeriod = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: groupBy,
          total: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    return res.status(200).json({
      success: true,
      data: salesByPeriod,
    })
  }

  // Báo cáo doanh số mặc định
  const salesReport = await Order.aggregate([
    { $match: filter },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        total: { $sum: "$total" },
        count: { $sum: 1 },
        orders: { $push: { id: "$_id", total: "$total", status: "$status" } },
      },
    },
    { $sort: { _id: -1 } },
  ])

  res.status(200).json({
    success: true,
    data: salesReport,
  })
})

// Báo cáo sản phẩm
export const getProductsReport = asyncHandler(async (req, res, next) => {
  // Báo cáo sản phẩm bán chạy
  if (req.path === "/products/top") {
    // Lấy các đơn hàng đã hoàn thành
    const completedOrders = await Order.find({
      status: { $in: ["processing", "shipped", "delivered"] },
    })

    // Tạo map để đếm số lượng và doanh thu của từng sản phẩm
    const productMap = {}

    completedOrders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item.product?.toString()

        if (!productMap[productId]) {
          productMap[productId] = {
            id: productId,
            name: item.name,
            soldCount: 0,
            revenue: 0,
          }
        }

        productMap[productId].soldCount += item.quantity
        productMap[productId].revenue += item.price * item.quantity
      })
    })

    // Chuyển map thành mảng và sắp xếp theo số lượng bán
    const topProducts = Object.values(productMap)
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, 10) // Lấy top 10

    return res.status(200).json({
      success: true,
      data: topProducts,
    })
  }

  // Báo cáo tồn kho
  if (req.path === "/products/inventory") {
    const lowStockProducts = await product
      ?.find({ stock: { $lt: 10 } })
      .sort({ stock: 1 })
      .limit(20)

    return res.status(200).json({
      success: true,
      data: lowStockProducts,
    })
  }

  // Báo cáo sản phẩm mặc định
  const productsReport = await product?.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        avgPrice: { $avg: "$price" },
        totalStock: { $sum: "$stock" },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $project: {
        category: "$category.name",
        count: 1,
        avgPrice: 1,
        totalStock: 1,
      },
    },
  ])

  res.status(200).json({
    success: true,
    data: productsReport,
  })
})

// Báo cáo khách hàng
export const getCustomersReport = asyncHandler(async (req, res, next) => {
  // Báo cáo khách hàng mua nhiều nhất
  if (req.path === "/customers/top") {
    const topCustomers = await Order.aggregate([
      {
        $match: {
          status: { $in: ["processing", "shipped", "delivered"] },
        },
      },
      {
        $group: {
          _id: "$user",
          totalSpent: { $sum: "$total" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          email: "$user.email",
          totalSpent: 1,
          orderCount: 1,
        },
      },
      {
        $sort: { totalSpent: -1 },
      },
      {
        $limit: 10,
      },
    ])

    return res.status(200).json({
      success: true,
      data: topCustomers,
    })
  }

  // Báo cáo khách hàng mới
  if (req.path === "/customers/new") {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const newCustomers = await User.find({
      role: "customer",
      createdAt: { $gte: thirtyDaysAgo },
    })
      .sort({ createdAt: -1 })
      .select("name email createdAt")

    return res.status(200).json({
      success: true,
      data: newCustomers,
    })
  }

  // Báo cáo khách hàng mặc định
  const customersReport = await User.aggregate([
    {
      $match: { role: "customer" },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ])

  res.status(200).json({
    success: true,
    data: customersReport,
  })
})

// Báo cáo đơn hàng
export const getOrdersReport = asyncHandler(async (req, res, next) => {
  // Thống kê đơn hàng theo trạng thái
  if (req.path === "/orders/by-status") {
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          total: { $sum: "$total" },
        },
      },
      {
        $sort: { count: -1 },
      },
    ])

    return res.status(200).json({
      success: true,
      data: ordersByStatus,
    })
  }

  // Thống kê đơn hàng theo thời gian
  if (req.path === "/orders/stats") {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const orderStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
          total: { $sum: "$total" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    return res.status(200).json({
      success: true,
      data: orderStats,
    })
  }

  // Báo cáo đơn hàng mặc định
  const ordersReport = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        avgTotal: { $avg: "$total" },
      },
    },
  ])

  res.status(200).json({
    success: true,
    data: ordersReport,
  })
})

// Thống kê tổng quan cho dashboard
export const getDashboardStats = asyncHandler(async (req, res, next) => {
  // Thống kê doanh số
  const salesStats = await Order.aggregate([
    {
      $match: {
        status: { $in: ["processing", "shipped", "delivered"] },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$total" },
        orderCount: { $sum: 1 },
        avgOrderValue: { $avg: "$total" },
      },
    },
  ])

  // Thống kê sản phẩm
  const productStats = await product?.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        totalStock: { $sum: "$stock" },
        avgPrice: { $avg: "$price" },
      },
    },
  ])

  // Thống kê khách hàng
  const customerStats = await User.aggregate([
    {
      $match: { role: "customer" },
    },
    {
      $group: {
        _id: null,
        totalCustomers: { $sum: 1 },
      },
    },
  ])

  // Thống kê đơn hàng theo trạng thái
  const orderStatusStats = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ])

  // Thống kê đơn hàng theo thời gian (7 ngày gần nhất)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const recentOrderStats = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        count: { $sum: 1 },
        total: { $sum: "$total" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ])

  res.status(200).json({
    success: true,
    data: {
      sales: salesStats.length > 0 ? salesStats[0] : { totalSales: 0, orderCount: 0, avgOrderValue: 0 },
      products: productStats.length > 0 ? productStats[0] : { totalProducts: 0, totalStock: 0, avgPrice: 0 },
      customers: customerStats.length > 0 ? customerStats[0] : { totalCustomers: 0 },
      orderStatus: orderStatusStats,
      recentOrders: recentOrderStats,
    },
  })
})

