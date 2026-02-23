import { TrafficStat } from "../../domain/entities";
import {
  TrafficStatsRepository,
  ListTrafficStatsParams,
} from "../../domain/repositories";

export class ListTrafficStatsUseCase {
  constructor(private repo: TrafficStatsRepository) {}
  async execute(params: ListTrafficStatsParams): Promise<TrafficStat[]> {
    return await this.repo.list(params);
  }
}
