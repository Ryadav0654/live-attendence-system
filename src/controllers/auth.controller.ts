import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  signUpZodSchema,
  loginZodSchema,
} from "../validation/zod.validation.js";
import User from "../models/user.model.js";
import { AppError } from "../utils/appError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { IRequest } from "../types/type.js";

export const signUpController = asyncHandler(
  async (req: Request, res: Response) => {
    const { data, success } = signUpZodSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        success: false,
        error: "Invalid request schema",
      });
    }
    const { name, email, role, password } = data;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already exists",
      });
    }

    const user = await User.create({
      name: name,
      email: email,
      password: password,
      role: role,
    });

    if (!user) {
      throw new AppError("User creation failed", 400);
    }

    const newUser = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return res.status(201).json({
      success: true,
      data: newUser,
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { data, success } = loginZodSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        success: false,
        error: "Invalid request schema",
      });
    }
    const { email, password } = data;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!process.env.JWTSECRET) {
      throw new AppError("JWT secret not configured", 500);
    }

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      process.env.JWTSECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      data: { token },
    });
  }
);

export const userController = asyncHandler(
  async (req: IRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized, token missing or invalid", 401);
    }

    const user = await User.findById(req.user.userId).select("-password -__v");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  }
);
