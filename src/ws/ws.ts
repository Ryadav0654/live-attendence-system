import { WebSocketServer } from "ws";
import { ROLE, STATUS } from "../types/type.js";
import { activeSession } from "../utils/attendanceSession.js";
import Attendance from "../models/attendance.model.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import Class from "../models/class.model.js";
import mongoose from "mongoose";
import type { AuthenticatedSocket } from "../types/type.js";
import { Server as HttpServer } from "http";

let wss: WebSocketServer;
const broadCast = (paylaod: any) => {
  if (!wss) return;

  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(paylaod));
    }
  });
};

const sendError = (socket: AuthenticatedSocket, message: string) => {
  socket.send(
    JSON.stringify({
      event: "ERROR",
      data: { message },
    }),
  );
};
export const initWebsocket = (server: HttpServer) => {
  wss = new WebSocketServer({ server });
  wss.on("connection", (socket: AuthenticatedSocket, request) => {
    const url = new URL(request.url!, "http://localhost");
    const token = url.searchParams.get("token")!;

    if (!token) {
      sendError(socket, "Unauthorized or invalid token");
      socket.close();
      return;
    }

    let decodedToken: JwtPayload;
    try {
      decodedToken = jwt.verify(token, process.env.JWTSECRET!) as JwtPayload;
    } catch {
      sendError(socket, "Unauthorized or invalid token");
      socket.close();
      return;
    }

    socket.user = {
      userId: decodedToken.userId,
      role: decodedToken.role,
    };

    socket.on("message", async (rawMessage: any) => {
      let parsedMessage: any;

      try {
        parsedMessage = JSON.parse(rawMessage.toString());
      } catch {
        sendError(socket, "Invalid message format");
        return;
      }

      const { event, data } = parsedMessage;
      switch (event) {
        case "ATTENDANCE_MARKED": {
          if (!socket.user || socket.user.role !== ROLE.TEACHER) {
            sendError(socket, "Forbidden, teacher event only");
            return;
          }

          if (!activeSession.getSession()) {
            sendError(socket, "No active attendance session");
            return;
          }
          const { studentId, status } = data;
          activeSession.markAttendance(studentId, status);

          broadCast({
            event: "ATTENDANCE_MARKED",
            data: {
              studentId,
              status,
            },
          });
          break;
        }
        case "TODAY_SUMMARY": {
          if (!socket.user || socket.user.role !== ROLE.TEACHER) {
            sendError(socket, "Forbidden, teacher event only");
            return;
          }

          const session = activeSession.getSession();
          if (!session) {
            sendError(socket, "No active attendance session");
            return;
          }

          const values = Object.values(session.attendance);

          const present = values.filter(
            (status) => status === STATUS.PRESENT,
          ).length;

          const absent = values.filter(
            (status) => status === STATUS.ABSENT,
          ).length;

          broadCast({
            event: "TODAY_SUMMARY",
            data: {
              present,
              absent,
              total: present + absent,
            },
          });
          break;
        }
        case "MY_ATTENDANCE": {
          if (!socket.user || socket.user.role !== ROLE.STUDENT) {
            sendError(socket, "Forbidden, student event only");
            return;
          }
          const session = activeSession.getSession();
          if (!session) {
            sendError(socket, "No active attendance session");
            return;
          }

          const status: STATUS | string =
            session.attendance[socket.user.userId] ?? "not yet updated";
          socket.send(
            JSON.stringify({
              event: "MY_ATTENDANCE",
              data: {
                status: status,
              },
            }),
          );
          break;
        }
        case "DONE": {
          if (!socket.user || socket.user.role !== ROLE.TEACHER) {
            sendError(socket, "Forbidden, teacher event only");
            return;
          }
          const session = activeSession.getSession();
          if (!session) {
            sendError(socket, "No active attendance session");
            return;
          }
          const foundClass = await Class.findById(
            new mongoose.Types.ObjectId(session.classId),
          )
            .select("-__v")
            .populate("studentIds", "_id");

          if (!foundClass) {
            sendError(socket, "No class found!");
            return;
          }

          await Promise.all(
            foundClass.studentIds.map((student) =>
              Attendance.create({
                classId: foundClass._id,
                studentId: student._id,
                status:
                  session.attendance[student._id.toString()] ?? STATUS.ABSENT,
              }),
            ),
          );
          const values = Object.values(session.attendance);

          const present = values.filter(
            (status) => status === STATUS.PRESENT,
          ).length;

          const absent = values.filter(
            (status) => status === STATUS.ABSENT,
          ).length;

          activeSession.clearSession();

          broadCast({
            event: "DONE",
            data: {
              message: "Attendance persisted",
              present: present,
              absent: absent,
              total: present + absent,
            },
          });
          break;
        }
        default: {
          sendError(socket, "Unknown event");
        }
      }
    });

    socket.on("close", () => {
      console.log("Socket closed:", socket.user?.userId);
    });
  });
};
