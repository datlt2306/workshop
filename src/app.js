import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { errorHandler } from "./middleware/errorHandler";
import { connectDB } from "./config/database";
import { swaggerOptions } from "./config/swagger";
import apiRouter from "./routes/index";
import dotenv from "dotenv";
dotenv.config();
// Kết nối cơ sở dữ liệu
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Rate limiting
const limiter = rateLimit({
    max: 100, // 100 requests
    windowMs: 15 * 60 * 1000, // per 15 minutes
    message: "Quá nhiều request từ IP này, vui lòng thử lại sau 15 phút!",
});
app.use("/api", limiter);

// Swagger documentation
const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Serving static files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/v1", apiRouter);

// Error handling
app.use(errorHandler);

export { app };
export const viteNodeApp = app; // Export the app for VitePluginNode
