import type { Request, Response, NextFunction } from "express";
import type { AuthedUser } from "../middlewares/auth.middleware";
import { GetMeUseCase } from "../../../application/usecases/get-me";

export class AuthController {
  constructor(private getMeUC: GetMeUseCase) {}

  me = (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user as AuthedUser | undefined;
      if (!user) return res.status(401).json({ error: "Unauthenticated" });

      const out = this.getMeUC.execute(user);
      return res.status(200).json(out);
    } catch (e) {
      return next(e);
    }
  };
}
