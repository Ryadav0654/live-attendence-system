import { test, describe, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("GET /health route test", () => {
  test("should return 200", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: "live attendance system backend is healthy!",
    });
  });
});
