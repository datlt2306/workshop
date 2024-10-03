import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import productRouter from "./routers/product";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

//routers
app.use("/api", productRouter);

mongoose.connect("mongodb://127.0.0.1:27017/workshop");

export const viteNodeApp = app;
