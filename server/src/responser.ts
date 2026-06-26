import type { Response } from 'express';

type StatusCodes = number;

interface PaginationMeta {
  page: number;
  nextPage: number;
  total: number;
}

export default class Responser {
  constructor(private readonly response: Response) {}

  public ok<T>(data: T, statusCode: StatusCodes = 200) {
    return this.response.status(statusCode).json({
      ok: true,
      data,
    });
  }

  public created<T>(data: T, statusCode: StatusCodes = 201) {
    return this.response.ok(data, statusCode);
  }

  public deleted(statusCode: StatusCodes = 200) {
    return this.response.status(statusCode).json({ ok: true });
  }

  public error<T>(
    stackTrace?: T,
    message?: string,
    statusCode: StatusCodes = 400,
  ) {
    return this.response.status(statusCode).json({
      ok: false,
      message,
      ...(stackTrace ? { errors: stackTrace } : {}),
    });
  }

  public internalServer(message: string) {
    return this.error('Internal Server Error', undefined, 500);
  }
  public notFound(message: string = 'Not Found') {
    return this.error(message, undefined, 404);
  }

  public pagination<T>(data: T, meta: any, statusCodes: number = 200) {
    return this.response.status(statusCodes).json({
      ok: true,
      data,
      meta,
    });
  }

  public keys() {
    return Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(
      key => !['constructor', 'keys'].includes(key),
    );
  }
}
