import DepartmentController, {
  RequestGetDepartments,
} from 'controllers/department.controller';
import { Router } from 'express';
import { validateRequest } from 'utils/express.utils';
import {
  BodySchemas,
  ParamsSchemas,
  QuerySchemas,
} from 'schemas/department.schemas';

const controller = new DepartmentController();

const router = Router();

router.get('/', validateRequest({ query: QuerySchemas.get }), (req, res) =>
  controller.get(req, res),
);
router.post('/', validateRequest({ body: BodySchemas.create }), (req, res) =>
  controller.create(req, res),
);

router.patch(
  '/:id',
  validateRequest({ body: BodySchemas.edit, params: ParamsSchemas.edit }),
  (req, res) => controller.edit(req, res),
);

router.delete(
  '/:id',
  validateRequest({ params: ParamsSchemas.delete }),
  (req, res) => controller.delete(req, res),
);

export default router;
