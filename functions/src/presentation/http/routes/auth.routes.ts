import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { AuthController } from "../controllers/auth.controller";
import { GetMeUseCase } from "../../../application/usecases/get-me";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const controller = new AuthController(new GetMeUseCase());
    router.use(authMiddleware);

    router.get("/me", controller.me);

    return router;
  }
}
