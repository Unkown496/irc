import { AbstractServerError, ErrorObject } from './abstract.error';

export class BadRequestError extends AbstractServerError {
  constructor(options?: ErrorObject) {
    super(400, {
      ...options,
      message: options?.message ?? 'Bad Request',
    });

    this.name = BadRequestError.name;
  }
}
