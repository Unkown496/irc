import z, { createParamsIdSchema } from 'utils/zod.utils';

import { QuerySchema as PaginationQuerySchema } from './pagination.schemas';

export const EmployeeSchema = z
  .object({
    name: z.string(),
    salary: z.optional(z.number().min(1)),
    hire_date: z.optional(z.coerce.date()),
    department_id: z.number().min(1),
  })
  .strict();

export const QuerySchemas = {
  get: PaginationQuerySchema,
};

export const BodySchemas = {
  create: EmployeeSchema,
  edit: EmployeeSchema.partial(),
};

export const ParamsSchemas = {
  delete: createParamsIdSchema(),
  edit: createParamsIdSchema(),
};
