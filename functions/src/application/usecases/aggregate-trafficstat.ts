import type { TrafficStatsRepository } from "../../domain/repositories/trafficstat.repository";

export type Granularity = "daily" | "weekly" | "monthly";
export type AggregatePoint = { period: string; visits: number };

export class AggregateTrafficStatsUseCase {
  constructor(private repo: TrafficStatsRepository) {}

  async execute(input: {
    from?: string;
    to?: string;
    granularity: Granularity;
  }): Promise<AggregatePoint[]> {
    const rows = await this.repo.list({
      from: input.from,
      to: input.to,
      sortBy: "date",
      order: "asc",
    });

    if (input.granularity === "daily") {
      return rows.map((r) => ({ period: r.date, visits: r.visits }));
    }
    const acc = new Map<string, number>();

    for (const r of rows) {
      const key =
        input.granularity === "monthly"
          ? r.date.slice(0, 7)
          : isoWeekKey(r.date);
      acc.set(key, (acc.get(key) ?? 0) + r.visits);
    }

    return [...acc.entries()]
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([period, visits]) => ({ period, visits }));
  }
}

function isoWeekKey(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  const day = (d.getUTCDay() + 6) % 7; 
  d.setUTCDate(d.getUTCDate() - day + 3); 

  const firstThu = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const firstDay = (firstThu.getUTCDay() + 6) % 7;
  firstThu.setUTCDate(firstThu.getUTCDate() - firstDay + 3);

  const weekNo =
    1 + Math.round((d.getTime() - firstThu.getTime()) / (7 * 24 * 3600 * 1000));
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}
