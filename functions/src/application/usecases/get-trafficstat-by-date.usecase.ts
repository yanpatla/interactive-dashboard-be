import { TrafficStat } from "../../domain/entities";
import { AppError } from "../../domain/errors";
import type {
  TrafficStatsRepository,
} from "../../domain/repositories";

export class GetTrafficStatByDateUseCase {
  constructor(private repo: TrafficStatsRepository) {}

  async execute(date: string): Promise<TrafficStat> {
    const row = await this.repo.getByDate(date);
    if (!row) throw AppError.notFound(`trafficStat for date ${date} not found`);
    return row;
  }
}
