import express from "express";
import type { Express, Request, Response } from "express";
import { errorHandler } from "./middleware/error-middleware.js";
import { logger } from "./utils/logger.js";
import verifyToken from "./middleware/verifyToken.js";
import * as OpenApiValidator from "express-openapi-validator";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import yaml from "yaml";

const file = fs.readFileSync("./src/docs/openapi.yaml", "utf8");
const openapi = yaml.parse(file);

openapi.servers = [
  {
    url:
      process.env.NODE_ENV === "production"
        ? "https://liveattendance.duckdns.org" // live server URL
        : "http://localhost:8080", // local server URL
    description:
      process.env.NODE_ENV === "production"
        ? "Production server"
        : "Local development server",
    variables: {
      version: {
        default: "v1",
        description: "API version",
      },
    },
  },
];

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));
app.use(
  OpenApiValidator.middleware({
    apiSpec: openapi,
    validateRequests: true, // (default)
    // validateResponses: true, // false by default
  }),
);

import authRouter from "./routers/auth.route.js";
import classRouter from "./routers/class.route.js";
import studentRouter from "./routers/student.route.js";
import attendanceRouter from "./routers/attendance.route.js";

app.use("/auth", authRouter);
app.use("/class", verifyToken, classRouter);
app.use("/students", verifyToken, studentRouter);
app.use("/attendance", verifyToken, attendanceRouter);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "hello from live attendance system backend!",
  });
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "live attendance system backend is healthy!",
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

export default app;
