import { type Response } from 'express';
import Department from 'models/department.model';
import { RequestWithValidation } from 'types/express.types';
import {
  BodySchemas,
  ParamsSchemas,
  QuerySchemas,
} from 'schemas/department.schemas';
import { BadRequestError } from 'errors/bad-request.error';
import { NotFoundError } from 'errors/not-found.error';

export type RequestGetDepartments = RequestWithValidation<
  any,
  any,
  typeof QuerySchemas.get
>;

export type RequestCreateDepartments = RequestWithValidation<
  typeof BodySchemas.create
>;

export type RequestEditDepartments = RequestWithValidation<
  typeof BodySchemas.edit,
  typeof ParamsSchemas.edit
>;

export type RequestDeleteDepartments = RequestWithValidation<
  any,
  typeof ParamsSchemas.delete
>;

export type RequestGetCurrentDepartments = RequestWithValidation<
  any,
  typeof ParamsSchemas.getCurrent
>;

export class DepartmentController {
  private readonly departmentRepo = new Department();

  async get(req: RequestGetDepartments, res: Response) {
    let filter = { page: 1, limit: 10 };

    if (req.validatedQuery)
      filter = {
        page: req.validatedQuery?.page ?? 1,
        limit: req.validatedQuery?.limit ?? 10,
      };

    const { data, meta } = await this.departmentRepo.findAll(
      filter.page,
      filter.limit,
    );

    if (filter.page > meta.totalPages) res.notFound();

    return res.pagination(data, meta);
  }

  async getCurrent(
    { validatedParams }: RequestGetCurrentDepartments,
    res: Response,
  ) {
    if (!validatedParams) throw new BadRequestError();

    const departmentById = await Department.findByPk(validatedParams.id);

    if (!departmentById) throw new NotFoundError();

    return res.ok(departmentById);
  }

  async create(req: RequestCreateDepartments, res: Response) {
    const { validatedBody } = req;

    if (!validatedBody) return res.error();

    const createdDepartment = await this.departmentRepo.create(validatedBody);

    return res.created(createdDepartment);
  }

  async edit(
    { validatedParams, validatedBody }: RequestEditDepartments,
    res: Response,
  ) {
    if (!validatedParams) return res.error();
    if (!validatedBody) return res.error();

    const editDepartment = await this.departmentRepo.edit(
      validatedParams.id,
      validatedBody,
    );

    if (!editDepartment) return res.notFound();

    return res.ok(editDepartment);
  }

  async delete({ validatedParams }: RequestDeleteDepartments, res: Response) {
    if (!validatedParams) return res.error();

    const isDeleted = await this.departmentRepo.delete(validatedParams.id);

    return isDeleted ? res.deleted() : res.notFound();
  }
}
