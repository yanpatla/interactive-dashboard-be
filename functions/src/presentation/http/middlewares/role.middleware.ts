import type { Request, Response, NextFunction } from "express";
import { isEditor } from "../../../config/roles";

export function requireEditor(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = res.locals.user as { email?: string } | undefined;
  if (!user)
    return res.status(401).json({ error: "Missing authenticated user" });

  if (!isEditor(user.email ?? null)) {
    return res.status(403).json({ error: "Editor role required" });
  }

  return next();
}
