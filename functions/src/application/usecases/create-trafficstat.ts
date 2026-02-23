import { TrafficStat } from "../../domain/entities";
import { TrafficStatsRepository } from "../../domain/repositories";

export class CreateTrafficStatUseCase {
  constructor(private repo: TrafficStatsRepository) {}
  async execute(input: { date: string; visits: number }): Promise<void> {
    const stat = new TrafficStat(input);
    return this.repo.create(stat);
  }
}
