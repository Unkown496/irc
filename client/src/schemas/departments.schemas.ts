import z from 'zod';

export const DepartmentSchema = z.object({
  name: z
    .string({ error: 'Имя должно быть строкой' })
    .min(1, { error: 'Имя обязательно' }),
  budget: z.optional(z.coerce.number({ error: 'Бюджет должен быть числом' })),
  established_date: z.optional(z.coerce.date({ error: 'Нужно выбрать дату' })),
});
