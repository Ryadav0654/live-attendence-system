import express from "express";
import type { Express, Request, Response } from "express";
import { errorHandler } from "./middleware/error-middleware.js";
import { logger } from "./utils/logger.js";
import verifyToken from "./middleware/verifyToken.js";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

import authRouter from "./routers/auth.route.js";
import classRouter from "./routers/class.route.js";
import studentRouter from "./routers/student.route.js";

app.use("/auth", authRouter);
app.use("/class", verifyToken, classRouter);
app.use("/", verifyToken, studentRouter);

app.get("/", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "hello from live attendance system backend!",
  });
});

// app.use((err:Error, _req:Request, res:Response, next:NextFunction) => {
//     if(err){
//         return res.status(500).json({message: "Internal server error!"})
//     }
//     next()
// })
app.use(errorHandler);

export default app;
