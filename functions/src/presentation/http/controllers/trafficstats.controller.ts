import type { NextFunction, Request, Response } from "express";
import { AggregateTrafficStatsUseCase } from "../../../application/usecases/aggregate-trafficstat";
import { CreateTrafficStatUseCase } from "../../../application/usecases/create-trafficstat";
import { DeleteTrafficStatUseCase } from "../../../application/usecases/delete-trafficstat";
import { GetTrafficStatByDateUseCase } from "../../../application/usecases/get-trafficstat-by-date.usecase";
import { ListTrafficStatsUseCase } from "../../../application/usecases/list-trafficstats";
import { UpdateTrafficStatUseCase } from "../../../application/usecases/update-trafficstat";
import {
  parseAggregateQuery,
  parseCreateBody,
  parseDateParam,
  parseListQuery,
  parseUpdateBody,
} from "../validators/trafficstats.validators";

export class TrafficStatsController {
  constructor(
    private listUC: ListTrafficStatsUseCase,
    private getByDateUC: GetTrafficStatByDateUseCase,
    private aggregateUC: AggregateTrafficStatsUseCase,
    private createUC: CreateTrafficStatUseCase,
    private updateUC: UpdateTrafficStatUseCase,
    private deleteUC: DeleteTrafficStatUseCase,
  ) {}
  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = parseListQuery(req.query);
      const rows = await this.listUC.execute(params);
      res.status(200).json(rows.map((r) => r.toJSON()));
    } catch (e) {
      next(e);
    }
  };

  getByDate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const date = parseDateParam(req.params.date);
      const row = await this.getByDateUC.execute(date);
      res.status(200).json(row.toJSON());
    } catch (e) {
      next(e);
    }
  };

  aggregate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = parseAggregateQuery(req.query);
      const points = await this.aggregateUC.execute(q);
      res.status(200).json(points);
    } catch (e) {
      next(e);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = parseCreateBody(req.body);
      await this.createUC.execute({
        date: dto.date,
        visits: Math.trunc(dto.visits),
      });
      res.send("Traffic stat created Successfully");
    } catch (e) {
      next(e);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const date = parseDateParam(req.params.date);
      const dto = parseUpdateBody(req.body);
      await this.updateUC.execute({ date, visits: Math.trunc(dto.visits) });
      res.send("Traffic stat updated Successfully");
    } catch (e) {
      next(e);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const date = parseDateParam(req.params.date);
      await this.deleteUC.execute(date);
      res.send("Traffic stat deleted Successfully");
    } catch (e) {
      next(e);
    }
  };
}
