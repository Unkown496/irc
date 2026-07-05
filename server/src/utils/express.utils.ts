import type { NextFunction, Request, Response } from 'express';
import { RequestSchema, RequestWithValidation } from 'types/express.types';
import { ZodAny, ZodError, ZodType } from 'zod';
import z from 'utils/zod.utils';
import { BadRequestError } from 'errors/bad-request.error';
import { InternalServerError } from 'errors/internal-server.error';

type ZodInfer<T extends ZodType> = z.infer<T>;

export const validateRequest = <
  Body extends ZodType = ZodAny,
  Params extends ZodType = ZodAny,
  Query extends ZodType = ZodAny,
>(
  schema: RequestSchema<Body, Params, Query>,
) => {
  return async (
    req: RequestWithValidation<Body, Params, Query>,
    _: Response,
    next: NextFunction,
  ) => {
    try {
      const {
        body: bodySchema,
        query: querySchema,
        params: paramsSchema,
      } = schema ?? {};

      if (bodySchema) req.validatedBody = await bodySchema.parseAsync(req.body);
      if (querySchema)
        req.validatedQuery = await querySchema.parseAsync(req.query);
      if (paramsSchema)
        req.validatedParams = await paramsSchema.parseAsync(req.params);

      return next();
    } catch (err) {
      console.log(err);

      if (err instanceof ZodError)
        // @ts-ignore
        throw new BadRequestError({
          details: z.treeifyError(err as ZodError<any>).errors,
        });

      throw new InternalServerError();
    }
  };
};

export const pagination = (
  total: number,
  currentPage: number,
  limit: number,
) => {
  const totalPages = Math.ceil(total / limit),
    prevPage = currentPage > 1 ? currentPage - 1 : null,
    nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return { total, totalPages, prevPage, nextPage };
};
