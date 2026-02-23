export type TrafficStatProps = {
  date: string;
  visits: number;
};

export class TrafficStat {
  public readonly date: string;
  public readonly visits: number;

  constructor({ date, visits }: TrafficStatProps) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error("Invalid date format, expected YYYY-MM-DD");
    }

    if (!Number.isInteger(visits) || visits < 0) {
      throw new Error("Visits must be a non-negative integer");
    }

    this.date = date;
    this.visits = visits;
  }
  toJSON() {
    return {
      date: this.date,
      visits: this.visits,
    };
  }
}
