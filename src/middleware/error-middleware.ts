import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import { AppError } from "../utils/appError.js";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // default values
  let statusCode = 500;
  let status = "error";
  let message = "Something went wrong";

  // custom error
  if (err instanceof AppError) {
    statusCode = (err as AppError).statusCode;
    status = (err as AppError).status;
    message = err.message;
  }

  // zod error or validation
  if (err instanceof ZodError) {
    statusCode = 400;
    message = `[${err.issues.map((issue) => issue.message).join(", ")}]`;
  }

  // 2. Log error for debugging (only in development)
  if (process.env.NODE_ENV === "development") {
    console.error("💥 Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    status: status,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
