import { Router } from 'express';
import { authMiddleware } from '../../../middleware/unifiedAuthMiddleware';
import { ValidationMiddleware } from '../../../middleware/validationMiddleware';
import { ReferenceController } from './controller';
import {
  createReferenceSchema,
  IdValidationSchema,
  updateReferenceSchema,
} from './validators';

const referenceRoutes = Router();
const controller = new ReferenceController();

// GET /references - Get all references with optional filters
// Query params: ?lawId=xxx or ?articleId=xxx or ?referenceId=xxx or ?type=Law
referenceRoutes.get('/', controller.getAllReferences);

// GET /references/:id - Get single reference by ID
referenceRoutes.get(
  '/:id',
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  controller.getReference,
);

// POST /references - Create a reference
// Body must include ONE of: lawId, articleId, or referenceId
referenceRoutes.post(
  '/',
  ValidationMiddleware({ type: 'body', schema: createReferenceSchema }),
  controller.createReference,
);

// ==========================================
// PROTECTED ROUTES (Auth Required)
// ==========================================

// PATCH /references/:id - Update reference
referenceRoutes.patch(
  '/:id',
  authMiddleware,
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  ValidationMiddleware({ type: 'body', schema: updateReferenceSchema }),
  controller.updateReference,
);

// DELETE /references/:id - Delete reference (soft delete)
referenceRoutes.delete(
  '/:id',
  authMiddleware,
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  controller.deleteReference,
);

export default referenceRoutes;