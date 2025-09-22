import express, { Router } from 'express';
import roleRoutes from './roles/routes';
import authRoutes from './auth/routes';
import userRoutes from './users/routes';
import subscriptionRoutes from './subscribers/routes';
import postRoutes from './posts/routes';
import commentRoutes from './comments/routes';
import chatBotRoutes from './chatbot/routes';
import ratingRoutes from './ratings/routes';
import profileRoutes from './profiles/routes';
import replyRoutes from './replies/routes';
import upvoteRoutes from './upvotes/routes';

const router: Router = express.Router();

router.use('/roles', roleRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/profiles', profileRoutes);
router.use('/ratings', ratingRoutes);
router.use('/subscribers', subscriptionRoutes);
router.use('/posts', postRoutes);
router.use('/posts', commentRoutes);
router.use('/posts', replyRoutes);
router.use('/posts', upvoteRoutes);
router.use('/documents', chatBotRoutes);

export default router;
