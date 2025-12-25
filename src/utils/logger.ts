import type { Request, Response, NextFunction } from "express";

export const logger = (req: Request, _res: Response, next: NextFunction) => {
  const logger = {
    path: req.path,
    method: req.method,
    size: req.headers["content-length"],
    timestamp: new Date().toISOString(),
  };
  console.log(logger);
  next();
};
