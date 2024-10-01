import express from "express";
import cors from "cors";
import productRouter from "./routers/product";

const app = express();

app.use(cors());

app.use("/api", productRouter);

export const viteNodeApp = app;
