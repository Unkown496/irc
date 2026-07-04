export interface ErrorObject {
  message?: string;
  description?: string;
  details?: unknown;
}

export abstract class AbstractServerError extends Error {
  public description?: string;
  public details?: unknown;

  constructor(
    public statusCode: number,
    options?: ErrorObject,
  ) {
    const { message, description, details } = options ?? {};
    super(message);

    this.description = description;
    this.details = details;
  }
}
