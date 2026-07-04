import { EmployeeController } from 'controllers/employee.controller';
import { Router } from 'express';
import {
  BodySchemas,
  ParamsSchemas,
  QuerySchemas,
} from 'schemas/employee.schemas';
import { validateRequest } from 'utils/express.utils';

const controller = new EmployeeController(),
  router = Router();

router
  .route('/')
  .get(
    validateRequest({
      query: QuerySchemas.get,
    }),
    (req, res) => controller.get(req, res),
  )
  .post(validateRequest({ body: BodySchemas.create }), (req, res) =>
    controller.create(req, res),
  );

router
  .route('/:id')
  .patch(
    validateRequest({
      params: ParamsSchemas.edit,
      body: BodySchemas.edit,
    }),
    (req, res) => controller.edit(req, res),
  )
  .delete(
    validateRequest({
      params: ParamsSchemas.delete,
    }),
    (req, res) => controller.delete(req, res),
  );

export default router;
