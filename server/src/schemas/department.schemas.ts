import z, { createParamsIdSchema } from 'utils/zod.utils';

const DepartmentSchema = z.object({
  name: z.string(),
  budget: z.optional(z.number()),
  establishedDate: z.optional(z.coerce.date()),
});

export const QuerySchemas = {
  get: z
    .object({
      page: z.coerce.number().min(1),
      limit: z.coerce.number().min(1),
    })
    .partial(),
};

export const BodySchemas = {
  create: DepartmentSchema,
  edit: DepartmentSchema.partial(),
};

export const ParamsSchemas = {
  delete: createParamsIdSchema(),
  edit: createParamsIdSchema(),
};
