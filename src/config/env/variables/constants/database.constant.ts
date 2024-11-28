import * as Joi from 'joi';

export const DATABASE_KEY = {
  DATABASE_URL: 'DATABASE_URL',
} as const;

export const DATABASE_KEY_VALIDATOR = {
  DATABASE_URL: Joi.string().required(),
} as const;
