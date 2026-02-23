import { TrafficStatsRepository } from "../../domain/repositories";

export class DeleteTrafficStatUseCase {
  constructor(private repo: TrafficStatsRepository) {}

  async execute(date: string): Promise<void> {
    return await this.repo.delete(date);
  }
}
