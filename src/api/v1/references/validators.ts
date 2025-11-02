import joi from 'joi';

export const createReferenceSchema = joi.object({
  type: joi.string().valid('Law', 'Article', 'Commentary').required().messages({
    'string.empty': 'Type is required',
    'any.only': 'Type must be one of: Law, Article, Commentary',
    'any.required': 'Type is required',
  }),
  title: joi.string().min(3).max(500).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 500 characters',
    'any.required': 'Title is required',
  }),
  citation: joi.string().min(3).max(500).required().messages({
    'string.empty': 'Citation is required',
    'string.min': 'Citation must be at least 3 characters long',
    'string.max': 'Citation cannot exceed 500 characters',
    'any.required': 'Citation is required',
  }),
  url: joi.string().uri().max(2000).optional().allow(null, '').messages({
    'string.uri': 'URL must be a valid URL',
    'string.max': 'URL cannot exceed 2000 characters',
  }),
  notes: joi.string().max(5000).optional().allow(null, '').messages({
    'string.max': 'Notes cannot exceed 5000 characters',
  }),
});

export const updateReferenceSchema = joi.object({
  type: joi.string().valid('Law', 'Article', 'Commentary').optional().messages({
    'string.empty': 'Type cannot be empty',
    'any.only': 'Type must be one of: Law, Article, Commentary',
  }),
  title: joi.string().min(3).max(500).optional().messages({
    'string.empty': 'Title cannot be empty',
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 500 characters',
  }),
  citation: joi.string().min(3).max(500).optional().messages({
    'string.empty': 'Citation cannot be empty',
    'string.min': 'Citation must be at least 3 characters long',
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
  lawId: joi.string().uuid().required().messages({
    'string.empty': 'Law ID is required',
    'string.guid': 'Law ID must be a valid UUID',
    'any.required': 'Law ID is required',
  }),
  id: joi.string().uuid().required().messages({
    'string.empty': 'Reference ID is required',
    'string.guid': 'Reference ID must be a valid UUID',
    'any.required': 'Reference ID is required',
  }),
});

export const LawIdValidationSchema = joi.object({
  lawId: joi.string().uuid().required().messages({
    'string.empty': 'Law ID is required',
    'string.guid': 'Law ID must be a valid UUID',
    'any.required': 'Law ID is required',
  }),
});