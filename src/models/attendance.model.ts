import mongoose, { model, Schema, Types } from "mongoose";
import type { IAttendance } from "../types/type.js";
import { STATUS } from "../types/type.js";

const attendanceSchema = new Schema<IAttendance>(
  {
    classId: {
      type: mongoose.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    studentId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(STATUS),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ classId: 1, studentId: 1 }, { unique: true });

const Attendance = model<IAttendance>("Attendance", attendanceSchema);
export default Attendance;
