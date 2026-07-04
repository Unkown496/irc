import z from 'zod';

export const EmployeeSchema = z.object({
  name: z
    .string({ error: 'Имя должно быть строкой' })
    .min(1, { error: 'Имя обязательно' }),
  salary: z.coerce
    .number({ error: 'Зарплата должна быть числом' })
    .min(1, { error: 'Зарплата обязательна' }),
  hire_date: z.coerce.date({ error: 'День принятия должен быть датой' }),
  department_id: z.coerce
    .number({ error: 'Должен быть id' })
    .min(1, { error: 'id Обязательно' }),
});
