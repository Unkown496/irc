import type { Request } from 'express';

import z from 'utils/zod.utils';
import type { ZodType } from 'zod';

export type RequestSchema<
  Body extends ZodType,
  Params extends ZodType,
  Query extends ZodType,
> = {
  body?: Body;
  params?: Params;
  query?: Query;
};

export type RequestWithValidation<
  Body extends ZodType = ZodType,
  Params extends ZodType = ZodType,
  Query extends ZodType = ZodType,
> = Request<z.infer<Params>, any, z.infer<Body>, z.infer<Query>> &
  Partial<{
    validatedBody: z.infer<Body>;
    validatedParams: z.infer<Params>;
    validatedQuery: z.infer<Query>;
  }>;

export enum GlobalConfig {
  GlobalPrefix = 'globalPrefix',
}
