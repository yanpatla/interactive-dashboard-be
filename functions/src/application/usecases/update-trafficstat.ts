import { TrafficStat } from "../../domain/entities";
import { TrafficStatsRepository } from "../../domain/repositories";

export class UpdateTrafficStatUseCase {
  constructor(private repo: TrafficStatsRepository) {}
  async execute(input: { date: string; visits: number }): Promise<void> {
    const stat = new TrafficStat({ date: input.date, visits: input.visits });
    return this.repo.update(input.date, stat);
  }
}
