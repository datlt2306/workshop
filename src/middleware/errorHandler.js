import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
// Xử lý lỗi từ Joi validation
const handleJoiError = (error) => {
    const message = error.details.map((detail) => detail.message).join("; ");
    return { message, statusCode: 400 };
};

// Xử lý lỗi từ MongoDB
const handleMongoError = (error) => {
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return {
            message: `Giá trị đã tồn tại cho trường '${field}'. Vui lòng sử dụng giá trị khác.`,
            statusCode: 400,
        };
    }

    if (error instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(error.errors).map((err) => err.message);
        return {
            message: errors.join(". "),
            statusCode: 400,
        };
    }

    if (error instanceof mongoose.Error.CastError) {
        return {
            message: `ID không hợp lệ: ${error.value}`,
            statusCode: 400,
        };
    }

    return null;
};

// Xử lý lỗi JWT
const handleJWTError = () => ({
    message: "Token không hợp lệ. Vui lòng đăng nhập lại!",
    statusCode: 401,
});

const handleJWTExpiredError = () => ({
    message: "Token đã hết hạn! Vui lòng đăng nhập lại.",
    statusCode: 401,
});

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
        this.name = "ValidationError";
    }
}

class AuthenticationError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
        this.name = "AuthenticationError";
    }
}

class AuthorizationError extends AppError {
    constructor(message = "Forbidden") {
        super(message, 403);
        this.name = "AuthorizationError";
    }
}

class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
        this.name = "NotFoundError";
    }
}

// Middleware xử lý lỗi chính
const errorHandler = (err, req, res, next) => {
    const error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode || 500;
    error.status = err.status || "error";

    // Development error
    if (process.env.NODE_ENV === "development") {
        return res.status(error.statusCode).json({
            status: error.status,
            error,
            message: error.message,
            stack: err.stack,
        });
    }

    // Xử lý các loại lỗi cụ thể
    if (err.name === "ValidationError" && err.isJoi) {
        const joiError = handleJoiError(err);
        error.statusCode = joiError.statusCode;
        error.message = joiError.message;
    }

    const mongoError = handleMongoError(err);
    if (mongoError) {
        error.statusCode = mongoError.statusCode;
        error.message = mongoError.message;
    }

    if (err.name === "JsonWebTokenError") {
        const jwtError = handleJWTError();
        error.statusCode = jwtError.statusCode;
        error.message = jwtError.message;
    }

    if (err.name === "TokenExpiredError") {
        const jwtExpiredError = handleJWTExpiredError();
        error.statusCode = jwtExpiredError.statusCode;
        error.message = jwtExpiredError.message;
    }

    // Production error - không gửi chi tiết kỹ thuật
    if (error.isOperational) {
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    } else {
        // Programming or unknown errors: don't leak error details
        console.error("ERROR 💥", err);
        return res.status(500).json({
            status: "error",
            message: "Something went wrong!",
        });
    }
};

export {
    AppError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    errorHandler,
};
