import { describe, it, expect, beforeAll, afterAll } from "vitest";foreAll, afterAll } from "vitest";
import request from "supertest";
import { viteNodeApp } from "./app";import { viteNodeApp } from "./app";
import mongoose from "mongoose";ose";

describe("Backend App", () => {cribe("Backend App", () => {
    let server;

    beforeAll((done) => {
        server = viteNodeApp.listen(4000, () => {ten(4000, () => {
            console.log("Test server running on port 4000");            console.log("Test server running on port 4000");
            done();
        });
    });    });

    afterAll((done) => {
        mongoose.connection.close();
        server.close(done);e(done);
    });

    it("should respond with 200 for GET /api", async () => {    it("should respond with 200 for GET /api", async () => {
        const res = await request(server).get("/api");t request(server).get("/api");
        expect(res.status).toBe(200);;
    });

    it("should respond with 404 for unknown routes", async () => {    it("should respond with 404 for unknown routes", async () => {
        const res = await request(server).get("/unknown");
        expect(res.status).toBe(404);
    });

    it("should create a new product", async () => {    it("should create a new product", async () => {
        const newProduct = { name: "Test Product", price: 100 };
        const res = await request(server)
            .post("/api/products")
            .send(newProduct);     .send(newProduct);
        expect(res.status).toBe(201);        expect(res.status).toBe(201);
        expect(res.body.name).toBe(newProduct.name);uct.name);
    });

    it("should get a list of products", async () => {
        const res = await request(server).get("/api/products");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("should register a new user", async () => {
        const newUser = { username: "testuser", password: "testpass" };
        const res = await request(server)
            .post("/api/register")
            .send(newUser);
        expect(res.status).toBe(201);
        expect(res.body.username).toBe(newUser.username);
    });

    it("should login a user", async () => {
        const user = { username: "testuser", password: "testpass" };
        const res = await request(server)
            .post("/api/login")
            .send(user);
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    // Add more tests for your routes here
});     expect(res.body.price).toBe(newProduct.price);
    });

    it("should get a list of products", async () => {
        const res = await request(server).get("/api/products");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("should get a single product by ID", async () => {
        const newProduct = { name: "Test Product", price: 100 };
        const createRes = await request(server)
            .post("/api/products")
            .send(newProduct);
        const productId = createRes.body._id;

        const res = await request(server).get(`/api/products/${productId}`);
        expect(res.status).toBe(200);
        expect(res.body._id).toBe(productId);
    });

    it("should update a product by ID", async () => {
        const newProduct = { name: "Test Product", price: 100 };
        const createRes = await request(server)
            .post("/api/products")
            .send(newProduct);
        const productId = createRes.body._id;

        const updatedProduct = { name: "Updated Product", price: 150 };
        const res = await request(server)
            .put(`/api/products/${productId}`)
            .send(updatedProduct);
        expect(res.status).toBe(200);
        expect(res.body.name).toBe(updatedProduct.name);
        expect(res.body.price).toBe(updatedProduct.price);
    });

    it("should delete a product by ID", async () => {
        const newProduct = { name: "Test Product", price: 100 };
        const createRes = await request(server)
            .post("/api/products")
            .send(newProduct);
        const productId = createRes.body._id;

        const res = await request(server).delete(`/api/products/${productId}`);
        expect(res.status).toBe(200);
    });
});
