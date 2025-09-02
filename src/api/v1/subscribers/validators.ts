import joi from 'joi';

export const AddEmailSchema = joi.object({
  email: joi.string().min(20).required(),
});
