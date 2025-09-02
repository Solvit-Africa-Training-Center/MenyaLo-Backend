import { Router } from 'express';
import { AuthController } from './controller';
import { ValidationMiddleware } from '../../../../middleware/validationMiddleware';
import { createUserSchema, LoginUserSchema } from './validators';
import { authMiddleware } from '../../../../middleware/authMiddleware';

const authRoutes = Router();
const controller = new AuthController();

authRoutes.post(
  '/register',
  ValidationMiddleware({ type: 'body', schema: createUserSchema }),
  controller.citizenRegister,
);
authRoutes.post(
  '/login',
  ValidationMiddleware({ type: 'body', schema: LoginUserSchema }),
  controller.login,
);
authRoutes.post('/logout', authMiddleware, controller.logout);

export default authRoutes;
