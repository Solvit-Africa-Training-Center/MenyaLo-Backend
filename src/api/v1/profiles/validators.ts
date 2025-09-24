import joi from 'joi';

export const createCitizenProfileSchema = joi.object({
  name: joi.string().required(),
  occupation: joi.string().optional(),
  bio: joi.string().optional(),
  phoneNumber: joi.string().pattern(/^\+?[\d\s-()]+$/).optional(),
  imageUrl: joi.string().uri().optional(),
});

export const createOrganizationProfileSchema = joi.object({
  name: joi.string().required(),
  imageUrl: joi.string().uri().optional(),
  bio: joi.string().optional(),
  website: joi.string().uri().optional(),
  phoneNumber: joi.string().pattern(/^\+?[\d\s-()]+$/).optional(),
  teamSize: joi.number().integer().min(1).optional(),
  yearsOfExperience: joi.number().integer().min(0).optional(),
  establishedAt: joi.date().optional(),
});

export const createLawFirmProfileSchema = joi.object({
  name: joi.string().required(),
  imageUrl: joi.string().uri().optional(),
  bio: joi.string().optional(),
  website: joi.string().uri().optional(),
  phoneNumber: joi.string().pattern(/^\+?[\d\s-()]+$/).optional(),
  teamSize: joi.number().integer().min(1).optional(),
  yearsOfExperience: joi.number().integer().min(0).optional(),
  caseResolved: joi.number().integer().min(0).optional(),
  successRate: joi.number().min(0).max(100).optional(),
  establishedAt: joi.date().optional(),
});

export const updateCitizenProfileSchema = joi.object({
  name: joi.string().optional(),
  occupation: joi.string().optional(),
  bio: joi.string().optional(),
  phoneNumber: joi.string().pattern(/^\+?[\d\s-()]+$/).optional(),
  imageUrl: joi.string().uri().optional(),
});

export const updateOrganizationProfileSchema = joi.object({
  name: joi.string().optional(),
  imageUrl: joi.string().uri().optional(),
  bio: joi.string().optional(),
  website: joi.string().uri().optional(),
  phoneNumber: joi.string().pattern(/^\+?[\d\s-()]+$/).optional(),
  teamSize: joi.number().integer().min(1).optional(),
  yearsOfExperience: joi.number().integer().min(0).optional(),
  establishedAt: joi.date().optional(),
});

export const updateLawFirmProfileSchema = joi.object({
  name: joi.string().optional(),
  imageUrl: joi.string().uri().optional(),
  bio: joi.string().optional(),
  website: joi.string().uri().optional(),
  phoneNumber: joi.string().pattern(/^\+?[\d\s-()]+$/).optional(),
  teamSize: joi.number().integer().min(1).optional(),
  yearsOfExperience: joi.number().integer().min(0).optional(),
  caseResolved: joi.number().integer().min(0).optional(),
  successRate: joi.number().min(0).max(100).optional(),
  establishedAt: joi.date().optional(),
});

export const IdValidationSchema = joi.object({
  id: joi.string().uuid().required(),
});