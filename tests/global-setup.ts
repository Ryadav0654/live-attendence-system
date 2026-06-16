import { beforeAll, beforeEach, afterAll } from "vitest";
import { connectDB, disconnectDB, clearDB } from "./setup.js";

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
