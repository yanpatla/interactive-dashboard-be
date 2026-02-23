export class AppError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    status = 500,
    code = "INTERNAL_ERROR",
    details?: unknown,
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static badRequest(message = "Bad Request", details?: unknown) {
    return new AppError(message, 400, "BAD_REQUEST", details);
  }

  static unauthorized(message = "Unauthorized") {
    return new AppError(message, 401, "UNAUTHORIZED");
  }

  static forbidden(message = "Forbidden") {
    return new AppError(message, 403, "FORBIDDEN");
  }

  static notFound(message = "Not Found") {
    return new AppError(message, 404, "NOT_FOUND");
  }

  static conflict(message = "Conflict") {
    return new AppError(message, 409, "CONFLICT");
  }

  static internal(message = "Internal Server Error") {
    return new AppError(message, 500, "INTERNAL_ERROR");
  }
}
