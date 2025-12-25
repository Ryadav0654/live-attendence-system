import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import User, { type ROLE } from "../models/user.model.js";

export interface IRequest extends Request {
  user: {
    userId: string;
    role: ROLE;
  };
}

const verifyToken = asyncHandler(
  async (req: IRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];

    // Check if the header exists and starts with 'Bearer'
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new AppError("Unauthorized, token missing or invalid", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Unauthorized, token missing or invalid", 401);
    }

    if (!process.env.JWTSECRET) {
      throw new AppError("JWT secret not configured", 500);
    }

    const decodedToken = jwt.verify(token, process.env.JWTSECRET) as JwtPayload;

    if (!decodedToken) {
      throw new AppError("Unauthorized, token missing or invalid", 401);
    }

    req.user = {
      userId: decodedToken.userId,
      role: decodedToken.role,
    };

    next();
  }
);

export default verifyToken;
