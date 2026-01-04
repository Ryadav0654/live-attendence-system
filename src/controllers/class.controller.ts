import type { Response } from "express";
import type { IRequest } from "../types/type.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createClassZodSchema } from "../validation/zod.validation.js";
import Class from "../models/class.model.js";
import { AppError } from "../utils/appError.js";
import z from "zod";
import User from "../models/user.model.js";
import Attendance from "../models/attendance.model.js";
import { Types } from "mongoose";
import { ROLE } from "../types/type.js";

export const createClass = asyncHandler(
  async (req: IRequest, res: Response) => {
    const { className } = createClassZodSchema.parse(req.body);
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

    const { studentId } = z
      .object({
        studentId: z.string(),
      })
      .parse(req.body);

    const student = await User.findById(studentId);
    if (!student || student.role !== ROLE.STUDENT) {
      throw new AppError("Invalid student", 400);
    }

    const updatedClass = await Class.findOneAndUpdate(
      {
        _id: classId,
        teacherId: req.user.userId,
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
