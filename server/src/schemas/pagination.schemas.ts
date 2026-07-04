import z from 'utils/zod.utils';

export const QuerySchema = z
  .object({
    page: z.coerce.number().min(1),
    limit: z.coerce.number().min(1),
  })
  .partial();
