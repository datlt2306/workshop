import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import productRouter from "./routes/product";
const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// routers
app.use(`/api`, productRouter);
// Kết nối tới MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/workshop");

export const viteNodeApp = app;
