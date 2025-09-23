import express, { Router } from 'express';
import roleRoutes from './roles/routes';
import authRoutes from './auth/routes';
import userRoutes from './users/routes';
import subscriptionRoutes from './subscribers/routes';
import postRoutes from './posts/routes';

const router: Router = express.Router();

router.use('/roles', roleRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/subscribers', subscriptionRoutes);
router.use('/posts', postRoutes);

export default router;
