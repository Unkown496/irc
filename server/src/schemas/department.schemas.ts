import z, { createParamsIdSchema } from 'utils/zod.utils';

import { QuerySchema as PaginationQuerySchema } from './pagination.schemas';

const DepartmentSchema = z
  .object({
    name: z.string(),
    budget: z.optional(z.number()),
    establishedDate: z.optional(z.coerce.date()),
  })
  .strict();

export const QuerySchemas = {
  get: PaginationQuerySchema,
};

export const BodySchemas = {
  create: DepartmentSchema,
  edit: DepartmentSchema.partial(),
};

export const ParamsSchemas = {
  getCurrent: createParamsIdSchema(),
  delete: createParamsIdSchema(),
  edit: createParamsIdSchema(),
};
