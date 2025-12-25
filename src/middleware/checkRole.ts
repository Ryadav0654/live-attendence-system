import type { NextFunction } from "express";
import type { IRequest } from "./verifyToken.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ROLE } from "../models/user.model.js";

export const isTeacher = asyncHandler(
  async (req: IRequest, _res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== ROLE.TEACHER) {
      throw new AppError("Forbidden", 403);
    }

    next();
  }
);

export const isStudent = asyncHandler(
  async (req: IRequest, _res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== ROLE.STUDENT) {
      throw new AppError("Forbidden", 403);
    }

    next();
  }
);
