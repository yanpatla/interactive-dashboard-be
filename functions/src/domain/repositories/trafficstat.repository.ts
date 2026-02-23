import { TrafficStat } from "../entities";

export type SortBy = "date" | "visits";
export type SortOrder = "asc" | "desc";

export type ListTrafficStatsParams = {
  from?: string;
  to?: string;
  sortBy?: SortBy;
  order?: SortOrder;
};

export interface TrafficStatsRepository {
  list(params: ListTrafficStatsParams): Promise<TrafficStat[]>;
  getByDate(date: string): Promise<TrafficStat | null>;

  create(input: TrafficStat): Promise<void>;
  update(date: string, stat: TrafficStat): Promise<void>; 
  delete(date: string): Promise<void>; 
}
