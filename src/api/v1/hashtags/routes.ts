import { Router } from 'express';
import { authMiddleware } from '../../../middleware/unifiedAuthMiddleware';
import { ValidationMiddleware } from '../../../middleware/validationMiddleware';
import { HashtagController } from './controller';
import { createPostSchema, hashtagNameValidationSchema } from './validators';

const hashtagRoutes = Router();
const postRoutes = Router();
const controller = new HashtagController();

// Hashtag routes
// Search should be defined before dynamic routes to avoid conflicts
hashtagRoutes.get('/search', controller.searchHashtags);

// GET /hashtags
hashtagRoutes.get('/', controller.getAllHashtags);

// GET /hashtags/trending
hashtagRoutes.get('/trending', controller.getTrendingHashtags);

// GET /hashtags/:name/posts
hashtagRoutes.get(
  '/:name/posts',
  ValidationMiddleware({ type: 'params', schema: hashtagNameValidationSchema }),
  controller.getPostsByHashtag,
);

// Post routes
// POST /posts
postRoutes.post(
  '/',
  authMiddleware,
  ValidationMiddleware({ type: 'body', schema: createPostSchema }),
  controller.createPost,
);

export { hashtagRoutes, postRoutes };