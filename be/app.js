import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import attributeRoutes from "./routes/attribute";
import productRouter from "./routes/product";
import categoryRoutes from "./routes/category";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", attributeRoutes);
app.use("/api", productRouter);
app.use("/api", categoryRoutes);

// Kết nối tới MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/workshop");

export const viteNodeApp = app;
