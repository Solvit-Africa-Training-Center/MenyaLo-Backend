import joi from 'joi';

export const createPostSchema = joi.object({
  title: joi.string().optional(),
  content: joi.string().required(),
});

export const updatePostSchema = joi.object({
  title: joi.string().optional(),
  content: joi.string().optional(),
  image: joi.string().optional(),
});

export const IdValidationSchema = joi.object({
  id: joi.string().uuid().required(),
});

export const paginationSchema = joi.object({
  page: joi.number().integer().min(1).optional(),
  limit: joi.number().integer().min(1).max(100).optional(),
});

export const hashtagNameSchema = joi.object({
  name: joi.string().pattern(/^[a-zA-Z0-9_]+$/).required(),
});

export const searchSchema = joi.object({
  q: joi.string().min(1).required(),
  page: joi.number().integer().min(1).optional(),
  limit: joi.number().integer().min(1).max(100).optional(),
});