import { asyncHandler } from "../utils/asyncHandler.js";
import type { Response } from "express";
import { attendanceZodSchema } from "../validation/zod.validation.js";
import Class from "../models/class.model.js";
import mongoose from "mongoose";
import type { IRequest } from "../types/type.js";
import { activeSession } from "../utils/attendanceSession.js";
import Attendance from "../models/attendance.model.js";

export const startAttendance = asyncHandler(
  async (req: IRequest, res: Response) => {
    const teacherId = req.user.userId;
    const { success, data } = attendanceZodSchema.safeParse(req.body);

    if (!success || !data.classId) {
      return res.status(400).json({
        success: false,
        error: "Invalid request schema",
      });
    }
    const { classId } = data;
    const foundClass = await Class.findOne({
      _id: new mongoose.Types.ObjectId(classId),
    });

    if (!foundClass) {
      return res.status(404).json({
        success: false,
        error: "Class not found",
      });
    }

    if (teacherId !== foundClass.teacherId.toString()) {
      return res.status(403).json({
        success: false,
        error: "Forbidden, not class teacher",
      });
    }

    activeSession.start(foundClass._id.toString());

    return res.status(200).json({
      success: true,
      data: {
        classId: foundClass._id,
        startedAt: new Date().toISOString(),
      },
    });
  }
);

export const getAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    const attendance = await Attendance.find();
    res.status(200).json({
      success: true,
      data: attendance,
    });
  }
);
