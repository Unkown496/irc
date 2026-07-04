import { AbstractServerError, ErrorObject } from './abstract.error';

export class InternalServerError extends AbstractServerError {
  constructor(options?: ErrorObject) {
    super(500, {
      ...options,
      message: options?.message ?? 'Internal Server Error',
    });

    this.name = InternalServerError.name;
  }
}
