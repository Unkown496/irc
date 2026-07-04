import { AbstractServerError } from 'errors/abstract.error';
import { BadRequestError } from 'errors/bad-request.error';
import { NotFoundError } from 'errors/not-found.error';
import { NextFunction, Request, Response } from 'express';

export default function useErrorCatcher<
  E extends AbstractServerError,
  Req extends Request,
  Res extends Response,
>(err: E, req: Req, res: Res, next: NextFunction) {
  console.log(err);

  if (err instanceof AbstractServerError)
    return res.error(err.message, err?.details, err.statusCode);

  if (!err) return next();

  return res.internalServer();
}
