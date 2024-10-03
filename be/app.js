import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import productRouter from "./routers/product";

const app = express();

app.use(cors());
app.use("/api", productRouter);

mongoose.connect("mongodb://127.0.0.1:27017/workshop");

export const viteNodeApp = app;
