import * as Joi from 'joi';

export const REDIS_KEY = {
  REDIS_URL: 'REDIS_URL',
  CACHE_TTL: 'CACHE_TTL',
} as const;

export const REDIS_KEY_VALIDATOR = {
  REDIS_URL: Joi.string().required(),
  CACHE_TTL: Joi.number().required(),
} as const;
