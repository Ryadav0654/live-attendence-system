import { Router } from "express";
import {
  startAttendance,
  getAttendance,
} from "../controllers/attendance.controller.js";
import { isTeacher } from "../middleware/checkRole.js";
const router: Router = Router();

router.post("/start", isTeacher, startAttendance);
router.get("/all", isTeacher, getAttendance);

export default router;
