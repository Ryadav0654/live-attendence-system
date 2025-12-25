import { isTeacher } from "./../middleware/checkRole.js";
import { Router } from "express";
import {
  addStudentInClass,
  createClass,
  getClass,
  getClassAttendence,
} from "../controllers/class.controller.js";

const router: Router = Router();

router.post("/", isTeacher, createClass);
router.post("/:id/add-student", isTeacher, addStudentInClass);
router.get("/:id", getClass);
router.get("/:id/my-attendance", getClassAttendence);
export default router;
