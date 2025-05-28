import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

import { errorHandler } from "./middleware/errorHandler";
import { connectDB } from "./config/database";
import { swaggerOptions } from "./config/swagger";
import apiRouter from "./routes/index";
import dotenv from "dotenv";
dotenv.config();
// Kết nối cơ sở dữ liệu
connectDB();

const app = express();

// Security Middleware
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
    })
);

// CORS configuration
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400, // 24 hours
};
app.use(cors(corsOptions));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Compression middleware
app.use(compression());

// Logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
} else {
    app.use(morgan("combined"));
}

// Rate limiting
const limiter = rateLimit({
    max: process.env.RATE_LIMIT_MAX || 100,
    windowMs: 15 * 60 * 1000,
    message: "Quá nhiều request từ IP này, vui lòng thử lại sau 15 phút!",
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api", limiter);

// Swagger documentation
const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server is running",
        timestamp: new Date().toISOString(),
    });
});

// Serving static files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/v1", apiRouter);

// Error handling
app.use(errorHandler);

export { app };
export const viteNodeApp = app; // Export the app for VitePluginNode
