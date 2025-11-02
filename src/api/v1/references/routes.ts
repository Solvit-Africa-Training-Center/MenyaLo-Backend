import { Router } from 'express';
import { authMiddleware } from '../../../middleware/unifiedAuthMiddleware';
import { ValidationMiddleware } from '../../../middleware/validationMiddleware';
import { ReferenceController } from './controller';
import {
  createReferenceSchema,
  IdValidationSchema,
  LawIdValidationSchema,
  updateReferenceSchema,
} from './validators';

const referenceRoutes = Router({ mergeParams: true });
const controller = new ReferenceController();

// GET /laws/:lawId/references
referenceRoutes.get(
  '/',
  ValidationMiddleware({ type: 'params', schema: LawIdValidationSchema }),
  controller.getAllReferences,
);

// GET /laws/:lawId/references/:id
referenceRoutes.get(
  '/:id',
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  controller.getReference,
);

// POST /laws/:lawId/references
referenceRoutes.post(
  '/',
  authMiddleware,
  ValidationMiddleware({ type: 'params', schema: LawIdValidationSchema }),
  ValidationMiddleware({ type: 'body', schema: createReferenceSchema }),
  controller.createReference,
);

// PATCH /laws/:lawId/references/:id
referenceRoutes.patch(
  '/:id',
  authMiddleware,
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  ValidationMiddleware({ type: 'body', schema: updateReferenceSchema }),
  controller.updateReference,
);

// DELETE /laws/:lawId/references/:id
referenceRoutes.delete(
  '/:id',
  authMiddleware,
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  controller.deleteReference,
);

export default referenceRoutes;