import { AppError } from "../../../domain/errors/app.error";
import type {
  SortBy,
  SortOrder,
} from "../../../domain/repositories/trafficstat.repository";
import type { Granularity } from "../../../application/usecases/aggregate-trafficstat";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function parseDateParam(date: unknown): string {
  if (typeof date !== "string" || !DATE_RE.test(date)) {
    throw AppError.badRequest("date param must be YYYY-MM-DD");
  }
  return date;
}

export function parseListQuery(q: any): {
  from?: string;
  to?: string;
  sortBy?: SortBy;
  order?: SortOrder;
} {
  const from = q?.from;
  const to = q?.to;
  const sortBy = q?.sortBy;
  const order = q?.order;

  if (from != null && (typeof from !== "string" || !DATE_RE.test(from))) {
    throw AppError.badRequest("from must be YYYY-MM-DD");
  }
  if (to != null && (typeof to !== "string" || !DATE_RE.test(to))) {
    throw AppError.badRequest("to must be YYYY-MM-DD");
  }
  if (sortBy != null && sortBy !== "date" && sortBy !== "visits") {
    throw AppError.badRequest("sortBy must be date|visits");
  }
  if (order != null && order !== "asc" && order !== "desc") {
    throw AppError.badRequest("order must be asc|desc");
  }

  return { from, to, sortBy, order };
}

export function parseAggregateQuery(q: any): {
  from?: string;
  to?: string;
  granularity: Granularity;
} {
  const from = q?.from;
  const to = q?.to;
  const granularity = (q?.granularity ?? "daily") as Granularity;

  if (from != null && (typeof from !== "string" || !DATE_RE.test(from))) {
    throw AppError.badRequest("from must be YYYY-MM-DD");
  }
  if (to != null && (typeof to !== "string" || !DATE_RE.test(to))) {
    throw AppError.badRequest("to must be YYYY-MM-DD");
  }
  if (
    granularity !== "daily" &&
    granularity !== "weekly" &&
    granularity !== "monthly"
  ) {
    throw AppError.badRequest("granularity must be daily|weekly|monthly");
  }

  return { from, to, granularity };
}
export function parseCreateBody(body: any): { date: string; visits: number } {
  const date = body?.date;
  const visits = body?.visits;

  if (typeof date !== "string") throw AppError.badRequest("date is required");
  if (!DATE_RE.test(date)) throw AppError.badRequest("date must be YYYY-MM-DD");

  if (typeof visits !== "number")
    throw AppError.badRequest("visits is required");
  if (!Number.isInteger(visits) || visits < 0) {
    throw AppError.badRequest("visits must be a non-negative integer");
  }

  return { date, visits };
}
export function parseUpdateBody(body: any): { visits: number } {
  const visits = body?.visits;

  if (typeof visits !== "number")
    throw AppError.badRequest("visits is required");
  if (!Number.isInteger(visits) || visits < 0) {
    throw AppError.badRequest("visits must be a non-negative integer");
  }

  return { visits };
}
