import joi from 'joi';

export const createPostSchema = joi.object({
  title: joi.string().min(5).max(500).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 5 characters long',
    'string.max': 'Title cannot exceed 500 characters',
    'any.required': 'Title is required',
  }),
  content: joi.string().min(10).max(10000).required().messages({
    'string.empty': 'Content is required',
    'string.min': 'Content must be at least 10 characters long',
    'string.max': 'Content cannot exceed 10000 characters',
    'any.required': 'Content is required',
  }),
  authorId: joi.string().uuid().required().messages({
    'string.empty': 'Author ID is required',
    'string.guid': 'Author ID must be a valid UUID',
    'any.required': 'Author ID is required',
  }),
});

export const updatePostSchema = joi.object({
  title: joi.string().min(5).max(500).optional().messages({
    'string.empty': 'Title cannot be empty',
    'string.min': 'Title must be at least 5 characters long',
    'string.max': 'Title cannot exceed 500 characters',
  }),
  content: joi.string().min(10).max(10000).optional().messages({
    'string.empty': 'Content cannot be empty',
    'string.min': 'Content must be at least 10 characters long',
    'string.max': 'Content cannot exceed 10000 characters',
  }),
});

export const postIdValidationSchema = joi.object({
  id: joi.string().uuid().required().messages({
    'string.empty': 'Post ID is required',
    'string.guid': 'Post ID must be a valid UUID',
    'any.required': 'Post ID is required',
  }),
});

export const hashtagNameValidationSchema = joi.object({
  name: joi.string().min(1).max(100).required().messages({
    'string.empty': 'Hashtag name is required',
    'string.min': 'Hashtag name must be at least 1 character long',
    'string.max': 'Hashtag name cannot exceed 100 characters',
    'any.required': 'Hashtag name is required',
  }),
});