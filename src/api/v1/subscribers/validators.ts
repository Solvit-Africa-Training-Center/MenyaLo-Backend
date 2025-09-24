import joi from 'joi';

export const AddEmailSchema = joi.object({
  email: joi.string().required(),
});
