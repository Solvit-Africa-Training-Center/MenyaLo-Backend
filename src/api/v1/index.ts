import express, { Router } from 'express';
import authRoutes from './auth/local/routes';
import userRoutes from './users/routes';
import healthRoutes from './health/routes';

const router: Router = express.Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/health', healthRoutes);

export default router;
