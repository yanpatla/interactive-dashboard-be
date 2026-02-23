import type { Request, Response, NextFunction } from "express";
import { adminAuth } from "../../../infrastructure/firebase/admin";

export type AuthedUser = {
  uid: string;
  email: string; 
  name: string | null; 
  picture: string | null;
};
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.header("authorization") || req.header("Authorization");
  if (!header)
    return res.status(401).json({ error: "Missing Authorization header" });

  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ error: "Invalid Authorization format. Use: Bearer <token>" });
  }

  return adminAuth
    .verifyIdToken(token)
    .then((decoded) => {
      const email = decoded.email;
      if (!email) {
        return res.status(401).json({ error: "Token has no email" });
      }

      res.locals.user = {
        uid: decoded.uid,
        email,
        name: decoded.name ?? null,
        picture: decoded.picture ?? null,
      } satisfies AuthedUser;

      return next();
    })
    .catch(() => res.status(401).json({ error: "Invalid or expired token" }));
}
