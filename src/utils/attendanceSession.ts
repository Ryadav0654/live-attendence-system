import type { STATUS } from "../types/type.js";
import { AppError } from "./appError.js";

interface IActiveSession {
  classId: string;
  startedAt: string;
  attendance: Record<string, STATUS>;
}

class AttendanceSession {
  private activeSession: IActiveSession | null = null;
  start(classId: string) {
    if (this.activeSession) {
      throw new AppError("Attendance session already active", 404);
    }
    this.activeSession = {
      classId: classId,
      startedAt: new Date().toISOString(),
      attendance: {},
    };

    return this.activeSession;
  }

  getSession() {
    return this.activeSession;
  }

  markAttendance(studentId: string, status: STATUS) {
    if (!this.activeSession) return;
    this.activeSession.attendance[studentId] = status;
  }

  clearSession() {
    this.activeSession = null;
  }
}

export const activeSession = new AttendanceSession();
