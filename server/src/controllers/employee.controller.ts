import { BadRequestError } from 'errors/bad-request.error';
import { NotFoundError } from 'errors/not-found.error';
import { Response } from 'express';
import Employee from 'models/employee.model';
import {
  BodySchemas,
  ParamsSchemas,
  QuerySchemas,
} from 'schemas/employee.schemas';
import { RequestWithValidation } from 'types/express.types';

type RequestGetEmployee = RequestWithValidation<
  any,
  any,
  typeof QuerySchemas.get
>;
type RequestPostEmployee = RequestWithValidation<typeof BodySchemas.create>;
type RequestPatchEmployee = RequestWithValidation<
  typeof BodySchemas.edit,
  typeof ParamsSchemas.edit
>;
type RequestDeleteEmployee = RequestWithValidation<
  any,
  typeof ParamsSchemas.delete
>;

export class EmployeeController {
  private readonly employeeRepo = new Employee();

  async get({ validatedQuery }: RequestGetEmployee, res: Response) {
    let { page, limit } = validatedQuery
      ? { page: validatedQuery.page ?? 1, limit: validatedQuery.limit ?? 10 }
      : { page: 1, limit: 10 };

    const { data, meta } = await this.employeeRepo.findAll(page, limit);

    if (page > meta.totalPages)
      throw new NotFoundError({
        message: 'Not found page',
      });

    return res.pagination(data, meta);
  }

  async create({ validatedBody }: RequestPostEmployee, res: Response) {
    if (!validatedBody)
      throw new BadRequestError({
        message: 'Body is required',
      });

    return res.created(await this.employeeRepo.create(validatedBody));
  }

  async edit(
    { validatedBody, validatedParams }: RequestPatchEmployee,
    res: Response,
  ) {
    if (!validatedParams)
      throw new BadRequestError({
        message: 'Params id is required',
        details: { params: { id: { required: true } } },
      });
    if (!validatedBody)
      throw new BadRequestError({ message: 'Body is required' });

    const updateEmployee = await this.employeeRepo.edit(
      validatedParams.id,
      validatedBody,
    );

    return res.ok(updateEmployee);
  }

  async delete({ validatedParams }: RequestDeleteEmployee, res: Response) {
    if (!validatedParams)
      throw new BadRequestError({ message: 'Params id is required' });

    await this.employeeRepo.delete(validatedParams.id);

    return res.deleted();
  }
}
