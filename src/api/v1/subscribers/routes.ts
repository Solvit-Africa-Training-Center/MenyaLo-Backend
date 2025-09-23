import { Router } from 'express';
import { authMiddleware } from '../../../middleware/unifiedAuthMiddleware';
import { checkRole } from '../../../middleware/ckeckRoleMiddleware';
import { ValidationMiddleware } from '../../../middleware/validationMiddleware';
import { AddEmailSchema } from './validators';
import { SubscriptionController } from './controller';

const subscriptionRoutes = Router();
const controller = new SubscriptionController();

subscriptionRoutes.get(
  '/',
  authMiddleware,
  checkRole(['admin']),
  controller.getSubscribers,
);
subscriptionRoutes.post(
  '/',
  ValidationMiddleware({ type: 'body', schema: AddEmailSchema }),
  controller.subscribe,
);
subscriptionRoutes.get('/unsubscribe', controller.unsubscribe);


export default subscriptionRoutes;
