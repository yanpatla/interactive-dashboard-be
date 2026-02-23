import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireEditor } from "../middlewares/role.middleware";
import { TrafficStatsController } from "../controllers/trafficstats.controller";
import { FireStoreTrafficStatRepository } from "../../../infrastructure/repositories/firestore-trafficstats.repository";
import { ListTrafficStatsUseCase } from "../../../application/usecases/list-trafficstats";
import { GetTrafficStatByDateUseCase } from "../../../application/usecases/get-trafficstat-by-date.usecase";
import { AggregateTrafficStatsUseCase } from "../../../application/usecases/aggregate-trafficstat";
import { CreateTrafficStatUseCase } from "../../../application/usecases/create-trafficstat";
import { UpdateTrafficStatUseCase } from "../../../application/usecases/update-trafficstat";
import { DeleteTrafficStatUseCase } from "../../../application/usecases/delete-trafficstat";

export class TrafficStatsRoutes {
  static get routes(): Router {
    const router = Router();

    const repo = new FireStoreTrafficStatRepository();

    const controller = new TrafficStatsController(
      new ListTrafficStatsUseCase(repo),
      new GetTrafficStatByDateUseCase(repo),
      new AggregateTrafficStatsUseCase(repo),
      new CreateTrafficStatUseCase(repo),
      new UpdateTrafficStatUseCase(repo),
      new DeleteTrafficStatUseCase(repo),
    );

    router.use(authMiddleware);

    router.get("/", controller.list);

    router.get("/aggregate", controller.aggregate);

    router.get("/:date", controller.getByDate);

    router.post("/", requireEditor, controller.create);
    router.put("/:date", requireEditor, controller.update);
    router.delete("/:date", requireEditor, controller.delete);

    return router;
  }
}
