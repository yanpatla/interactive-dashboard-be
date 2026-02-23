import { TrafficStat } from "../../domain/entities";
import { AppError } from "../../domain/errors";
import {
  ListTrafficStatsParams,
  TrafficStatsRepository,
} from "../../domain/repositories";
import { db } from "../firebase/admin";

export class FireStoreTrafficStatRepository implements TrafficStatsRepository {
  private col = db.collection("trafficStats");

  async list(params: ListTrafficStatsParams): Promise<TrafficStat[]> {
    let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
      this.col;
    if (params.from) query = query.where("date", ">=", params.from);
    if (params.to) query = query.where("date", "<=", params.to);

    const order = params.order ?? "asc";
    query = query.orderBy("date", order);

    const snap = await query.get();
    const rows = snap.docs.map((d) => {
      const data = d.data() as { date: string; visits: number };
      return new TrafficStat({ date: data.date, visits: data.visits });
    });
    if ((params.sortBy ?? "date") === "visits") {
      rows.sort((a, b) =>
        order === "asc" ? a.visits - b.visits : b.visits - a.visits,
      );
    }
    return rows;
  }
  async getByDate(date: string): Promise<TrafficStat | null> {
    const doc = await this.col.doc(date).get();
    if (!doc.exists) return null;
    const data = doc.data() as { date: string; visits: number };
    return new TrafficStat({ date: data.date, visits: data.visits });
  }
  async create(input: TrafficStat): Promise<void> {
    try {
      await this.col.doc(input.date).create(input.toJSON());
    } catch (error) {
      const msg = String((error as any).message ?? "").toLowerCase();
      if (msg.includes("already exists")) {
        throw AppError.conflict(
          `trafficStat for date ${input.date} already exists`,
        );
      }
      throw error;
    }
  }
  async update(date: string, stat: TrafficStat): Promise<void> {
    const res = this.col.doc(date);
    const snap = await res.get();
    if (!snap.exists) {
      throw AppError.notFound(`trafficStat for date ${date} not found`);
    }
    await res.update(stat.toJSON());
  }
  async delete(date: string): Promise<void> {
    const res = this.col.doc(date);
    const snap = await res.get();
    if (!snap.exists) {
      throw AppError.notFound(`trafficStat for date ${date} not found`);
    }
    await res.delete();
  }
}
