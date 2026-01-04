import { Router } from "express";
import { getStudents } from "../controllers/student.controller.js";
import { isTeacher } from "../middleware/checkRole.js";

const router: Router = Router();

router.get("/", isTeacher, getStudents);

export default router;
