import express, { Router } from 'express';
import roleRoutes from './roles/routes';
import authRoutes from './auth/routes';
import userRoutes from './users/routes';
import subscriptionRoutes from './subscribers/routes';
import postRoutes from './posts/routes';
import chatbotRoutes from './chatbot/routes';

const router: Router = express.Router();

router.use('/roles', roleRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/subscription', subscriptionRoutes);
router.use('/posts', postRoutes);
router.use('/chatbot', chatbotRoutes);

export default router;
