import type { Response } from "express";
import type { IRequest } from "../middleware/verifyToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createClassZodSchema } from "../validation/zod.validation.js";
import Class from "../models/class.model.js";
import { AppError } from "../utils/appError.js";
import z from "zod";
import User, { ROLE } from "../models/user.model.js";

export const createClass = asyncHandler(
  async (req: IRequest, res: Response) => {
    const { className } = createClassZodSchema.parse(req.body);
    const teacherId = req.user?.userId!;

    const createdClass = await Class.create({
      className,
      teacherId,
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

export const getClassAttendence = asyncHandler(
  async (req: IRequest, res: Response) => {}
);
