import type { NextFunction } from "express";
import type { IRequest } from "../types/type.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ROLE } from "../types/type.js";

export const isTeacher = asyncHandler(
  async (req: IRequest, _res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== ROLE.TEACHER) {
      throw new AppError("Forbidden, teacher access required", 403);
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
