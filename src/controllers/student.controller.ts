import type { Response } from "express";
import type { IRequest } from "../types/type.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { ROLE } from "../types/type.js";

export const getStudents = asyncHandler(
  async (req: IRequest, res: Response) => {
    const students = await User.find({ role: ROLE.STUDENT }).select(
      "-password -__v -createdAt -updatedAt"
    );

    return res.status(200).json({
      success: true,
      data: students,
    });
  }
);
