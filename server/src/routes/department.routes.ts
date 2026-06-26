import { DepartmentController } from 'controllers/department.controller';
import { Router } from 'express';
import { validateRequest } from 'utils/express.utils';
import {
  BodySchemas,
  ParamsSchemas,
  QuerySchemas,
} from 'schemas/department.schemas';

const controller = new DepartmentController(),
  router = Router();

router
  .route('/')
  .get(validateRequest({ query: QuerySchemas.get }), (req, res) =>
    controller.get(req, res),
  )
  .post(validateRequest({ body: BodySchemas.create }), (req, res) =>
    controller.create(req, res),
  );

router
  .route('/:id')
  .patch(
    validateRequest({ body: BodySchemas.edit, params: ParamsSchemas.edit }),
    (req, res) => controller.edit(req, res),
  )
  .delete(validateRequest({ params: ParamsSchemas.delete }), (req, res) =>
    controller.delete(req, res),
  );

export default router;
