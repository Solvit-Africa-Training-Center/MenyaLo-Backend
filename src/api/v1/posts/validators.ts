import joi from 'joi';

export const createPostSchema = joi.object({
  title: joi.string().required(),
  content: joi.string().required(),
});

export const updatePostSchema = joi.object({
  title: joi.string().optional(),
  content: joi.string().optional(),
});

export const IdValidationSchema = joi.object({
  id: joi.string().min(24),
});
