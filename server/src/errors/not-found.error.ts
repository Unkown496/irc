import { AbstractServerError, ErrorObject } from './abstract.error';

export class NotFoundError extends AbstractServerError {
  constructor(options?: ErrorObject) {
    super(404, { ...options, message: options?.message ?? 'Not Found' });

    this.name = NotFoundError.name;
  }
}
