import type { Response } from "express";
import type { IRequest } from "../types/type.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createClassZodSchema } from "../validation/zod.validation.js";
import Class from "../models/class.model.js";
import { AppError } from "../utils/appError.js";
import z from "zod";
import User from "../models/user.model.js";
import Attendance from "../models/attendance.model.js";
import mongoose, { Types } from "mongoose";
import { ROLE } from "../types/type.js";

export const createClass = asyncHandler(
  async (req: IRequest, res: Response) => {
    const { data, success } = createClassZodSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        success: false,
        error: "Invalid request schema",
      });
    }
    const { className } = data;
    const teacherId = req.user?.userId!;

    const createdClass = await Class.create({
      className,
      teacherId: new Types.ObjectId(teacherId),
    });

    return res.status(201).json({
      success: true,
      data: createdClass,
    });
  }
);

export const addStudentInClass = asyncHandler(
  async (req: IRequest, res: Response) => {
    const classId = req.params.id;

    const { data, success } = z
      .object({
        studentId: z.string(),
      })
      .safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        success: false,
        error: "Invalid request schema",
      });
    }
    const { studentId } = data;

    const student = await User.findOne({
      _id: new mongoose.Types.ObjectId(studentId),
      role: ROLE.STUDENT,
    });

    if (!student) {
      throw new AppError("Student not found", 404);
    }

    const updatedClass = await Class.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(classId),
        teacherId: new mongoose.Types.ObjectId(req.user.userId),
      },
      { $addToSet: { studentIds: student._id } },
      { new: true }
    );

    if (!updatedClass) {
      throw new AppError("Class not found", 404);
    }

    return res.status(200).json({
      success: true,
      data: updatedClass,
    });
  }
);

export const getClass = asyncHandler(async (req: IRequest, res: Response) => {
  const classId = req.params.id;
  const { userId, role } = req.user;

  const foundClass = await Class.findById(classId)
    .select("-__v")
    .populate("studentIds", "_id name email");

  if (!foundClass) {
    throw new AppError("Class not found", 404);
  }

  const isTeacherOwner =
    role === ROLE.TEACHER && foundClass.teacherId.toString() === userId;

  const isStudentEnrolled =
    role === ROLE.STUDENT &&
    foundClass.studentIds.some((studentId) => studentId.toString() === userId);

  if (!isTeacherOwner && !isStudentEnrolled) {
    throw new AppError("Forbidden", 403);
  }

  return res.status(200).json({
    success: true,
    data: foundClass,
  });
});

export const getClassAttendance = asyncHandler(
  async (req: IRequest, res: Response) => {
    const classId = req.params.id;

    if (!classId) {
      throw new AppError("Class id is required", 400);
    }
    const { userId } = req.user;

    const attendance = await Attendance.findOne({
      classId: new Types.ObjectId(classId),
      studentId: new Types.ObjectId(userId),
    }).select("-__v");

    // if attendance not exists
    if (!attendance) {
      return res.status(200).json({
        success: true,
        data: {
          classId,
          status: null,
        },
      });
    }

    // ✅ Attendance exists
    return res.status(200).json({
      success: true,
      data: {
        classId,
        status: attendance.status,
      },
    });
  }
);
