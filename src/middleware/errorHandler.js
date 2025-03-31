import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
// Xử lý lỗi từ Joi validation
const handleJoiError = (error) => {
  const message = error.details.map((detail) => detail.message).join("; ")
  return { message, statusCode: 400 }
}

// Xử lý lỗi từ MongoDB
const handleMongoError = (error) => {
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0]
    return {
      message: `Giá trị đã tồn tại cho trường '${field}'. Vui lòng sử dụng giá trị khác.`,
      statusCode: 400,
    }
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(error.errors).map((err) => err.message)
    return {
      message: errors.join(". "),
      statusCode: 400,
    }
  }

  if (error instanceof mongoose.Error.CastError) {
    return {
      message: `ID không hợp lệ: ${error.value}`,
      statusCode: 400,
    }
  }

  return null
}

// Xử lý lỗi JWT
const handleJWTError = () => ({
  message: "Token không hợp lệ. Vui lòng đăng nhập lại!",
  statusCode: 401,
})

const handleJWTExpiredError = () => ({
  message: "Token đã hết hạn! Vui lòng đăng nhập lại.",
  statusCode: 401,
})

// Middleware xử lý lỗi chính
export const errorHandler = (err, req, res, next) => {
  const error = { ...err }
  error.message = err.message
  error.statusCode = err.statusCode || 500

  // Development error
  if (process.env.NODE_ENV === "development") {
    return res.status(error.statusCode).json({
      success: false,
      error,
      message: error.message,
      stack: err.stack,
    })
  }

  // Xử lý các loại lỗi cụ thể
  if (err.name === "ValidationError" && err.isJoi) {
    const joiError = handleJoiError(err)
    error.statusCode = joiError.statusCode
    error.message = joiError.message
  }

  const mongoError = handleMongoError(err)
  if (mongoError) {
    error.statusCode = mongoError.statusCode
    error.message = mongoError.message
  }

  if (err.name === "JsonWebTokenError") {
    const jwtError = handleJWTError()
    error.statusCode = jwtError.statusCode
    error.message = jwtError.message
  }

  if (err.name === "TokenExpiredError") {
    const jwtExpiredError = handleJWTExpiredError()
    error.statusCode = jwtExpiredError.statusCode
    error.message = jwtExpiredError.message
  }

  // Production error - không gửi chi tiết kỹ thuật
  return res.status(error.statusCode).json({
    success: false,
    message: error.message || "Đã xảy ra lỗi!",
  })
}

