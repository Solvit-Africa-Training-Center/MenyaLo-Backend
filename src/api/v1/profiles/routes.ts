import { Router } from 'express';
import { authMiddleware } from '../../../middleware/unifiedAuthMiddleware';
import { ValidationMiddleware } from '../../../middleware/validationMiddleware';
import { ProfileController } from './controller';
import { 
  createCitizenProfileSchema, 
  createOrganizationProfileSchema, 
  createLawFirmProfileSchema,
  updateCitizenProfileSchema,
  updateOrganizationProfileSchema,
  updateLawFirmProfileSchema,
  IdValidationSchema, 
} from './validators';
import { upload } from '../../../utils/upload';

const profileRoutes = Router();
const controller = new ProfileController();

// GET routes - public access for browsing profiles
profileRoutes.get('/', controller.getAllProfiles);
profileRoutes.get('/citizens', controller.getAllCitizenProfiles);
profileRoutes.get('/organizations', controller.getAllOrganizationProfiles);
profileRoutes.get('/law-firms', controller.getAllLawFirmProfiles);
profileRoutes.get(
  '/:id',
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  controller.getAProfile,
);

// POST routes - role-specific profile creation (auth required)
profileRoutes.post(
  '/citizen',
  authMiddleware,
  upload.single('image'),
  ValidationMiddleware({ type: 'body', schema: createCitizenProfileSchema }),
  controller.createProfile,
);

profileRoutes.post(
  '/organization',
  authMiddleware,
  upload.single('image'),
  ValidationMiddleware({ type: 'body', schema: createOrganizationProfileSchema }),
  controller.createProfile,
);

profileRoutes.post(
  '/law-firm',
  authMiddleware,
  upload.single('image'),
  ValidationMiddleware({ type: 'body', schema: createLawFirmProfileSchema }),
  controller.createProfile,
);

// PATCH routes - role-specific profile updates (auth required)
profileRoutes.patch(
  '/:id/citizen',
  authMiddleware,
  upload.single('image'),
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  ValidationMiddleware({ type: 'body', schema: updateCitizenProfileSchema }),
  controller.updateProfile,
);

profileRoutes.patch(
  '/:id/organization',
  authMiddleware,
  upload.single('image'),
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  ValidationMiddleware({ type: 'body', schema: updateOrganizationProfileSchema }),
  controller.updateProfile,
);

profileRoutes.patch(
  '/:id/law-firm',
  authMiddleware,
  upload.single('image'),
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  ValidationMiddleware({ type: 'body', schema: updateLawFirmProfileSchema }),
  controller.updateProfile,
);

// DELETE route - requires authentication
profileRoutes.delete(
  '/:id',
  authMiddleware,
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  controller.deleteProfile,
);

export default profileRoutes;