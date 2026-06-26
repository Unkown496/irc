import * as z from 'zod';

export const createParamsIdSchema = () =>
  z.object({
    id: z.coerce.number(),
  });

export default z;
