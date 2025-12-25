import { Router } from "express";
import {
  signUpController,
  loginController,
  userController,
} from "../controllers/auth.controller.js";
import verifyToken from "../middleware/verifyToken.js";
const router: Router = Router();

router.post("/signup", signUpController);
router.post("/login", loginController);
router.get("/me", verifyToken, userController);

export default router;
