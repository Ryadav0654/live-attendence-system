import type { WebSocket } from "ws";
import type { Request } from "express";
import type { Types } from "mongoose";

export interface AuthenticatedSocket extends WebSocket {
  user?: {
    userId: string;
    role: ROLE;
  };
}

export interface IRequest extends Request {
  user: {
    userId: string;
    role: ROLE;
  };
}

export enum STATUS {
  "PRESENT" = "present",
  "ABSENT" = "absent",
}

export interface IAttendance {
  classId: Types.ObjectId;
  studentId: Types.ObjectId;
  status: STATUS;
}

export interface IClass {
  className: string;
  teacherId: Types.ObjectId;
  studentIds: Types.ObjectId[];
}

export enum ROLE {
  TEACHER = "teacher",
  STUDENT = "student",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: ROLE;
}
