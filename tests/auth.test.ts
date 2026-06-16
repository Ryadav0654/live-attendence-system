import {
  test,
  describe,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "vitest";

import request from "supertest";
import app from "../src/app.js";
import { connectDB, disconnectDB, clearDB } from "./setup.js";

describe("/auth route test", () => {
  beforeAll(async () => {
    console.log("connecting to database...");
    await connectDB();
    console.log("database connected");
  });

  beforeEach(async () => {
    await clearDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });
  describe("POST /auth/register route test", () => {
    test("should register successfully", async () => {
      const response = await request(app).post("/auth/register").send({
        name: "test",
        email: "R6l2o@example.com",
        password: "password",
        role: "student",
      });
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        name: "test",
        email: "R6l2o@example.com",
        role: "student",
      });
    });

    test("should not register with existing email", async () => {
      const firstResponse = await request(app).post("/auth/register").send({
        name: "test",
        email: "R6l2o@example.com",
        password: "password",
        role: "student",
      });
      expect(firstResponse.status).toBe(201);
      const response = await request(app).post("/auth/register").send({
        name: "test",
        email: "R6l2o@example.com",
        role: "student",
        password: "password",
      });
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Email already exists");
    });
  });

  describe("POST /auth/login route test", () => {
    test("should login successfully", async () => {
      const registerResponse = await request(app).post("/auth/register").send({
        name: "test",
        email: "R6l2o@example.com",
        role: "student",
        password: "password",
      });
      expect(registerResponse.status).toBe(201);

      const response = await request(app).post("/auth/login").send({
        email: "R6l2o@example.com",
        password: "password",
      });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        token: expect.any(String),
      });
    });

    test("should not login with invalid credentials", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "R6l2o@example.com",
        password: "wrong-password",
      });
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Invalid email or password");
    });
  });
});
