import joi from 'joi';

export const createReferenceSchema = joi.object({
  lawId: joi.string().uuid().optional().messages({
    'string.guid': 'Law ID must be a valid UUID',
  }),
  articleId: joi.string().uuid().optional().messages({
    'string.guid': 'Article ID must be a valid UUID',
  }),
  referenceId: joi.string().uuid().optional().messages({
    'string.guid': 'Reference ID must be a valid UUID',
  }),
  title: joi.string().min(3).max(500).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 500 characters',
    'any.required': 'Title is required',
  }),
  citation: joi.string().max(500).optional().allow(null, '').messages({
    'string.max': 'Citation cannot exceed 500 characters',
  }),
  url: joi.string().uri().max(2000).optional().allow(null, '').messages({
    'string.uri': 'URL must be a valid URL',
    'string.max': 'URL cannot exceed 2000 characters',
  }),
  notes: joi.string().max(5000).optional().allow(null, '').messages({
    'string.max': 'Notes cannot exceed 5000 characters',
  }),
})
  .or('lawId', 'articleId', 'referenceId')
  .messages({
    'object.missing': 'At least one of lawId, articleId, or referenceId is required',
  });

export const updateReferenceSchema = joi.object({
  title: joi.string().min(3).max(500).optional().messages({
    'string.empty': 'Title cannot be empty',
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 500 characters',
  }),
  citation: joi.string().max(500).optional().allow(null, '').messages({
    'string.max': 'Citation cannot exceed 500 characters',
  }),
  url: joi.string().uri().max(2000).optional().allow(null, '').messages({
    'string.uri': 'URL must be a valid URL',
    'string.max': 'URL cannot exceed 2000 characters',
  }),
  notes: joi.string().max(5000).optional().allow(null, '').messages({
    'string.max': 'Notes cannot exceed 5000 characters',
  }),
});

export const IdValidationSchema = joi.object({
  id: joi.string().uuid().required().messages({
    'string.empty': 'Reference ID is required',
    'string.guid': 'Reference ID must be a valid UUID',
    'any.required': 'Reference ID is required',
  }),
});