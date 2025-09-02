import { Router } from 'express';
import { authMiddleware } from '../../../middleware/unifiedAuthMiddleware';
import { checkRole } from '../../../middleware/ckeckRoleMiddleware';
import { ValidationMiddleware } from '../../../middleware/validationMiddleware';
import { AddEmailSchema } from './validators';
import { SubscriptionController } from './controller';

const subscriptionRoutes = Router();
const controller = new SubscriptionController();

subscriptionRoutes.get(
  '/subscribers',
  authMiddleware,
  checkRole(['admin']),
  controller.getSubscribers,
);
subscriptionRoutes.get('/unsubscribe', controller.unsubscribe);
subscriptionRoutes.post(
  '/subscribe',
  ValidationMiddleware({ type: 'body', schema: AddEmailSchema }),
  controller.subscribe,
);

export default subscriptionRoutes;
