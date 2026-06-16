import { test, describe, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("ROOT route test", () => {
  test("should return 200", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: "hello from live attendance system backend!",
    });
  });
});
