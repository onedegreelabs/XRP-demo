import * as Joi from 'joi';

export const JWT_KEY = {
  ACCESS_TOKEN_SECRET: 'ACCESS_TOKEN_SECRET',
  REFRESH_TOKEN_SECRET: 'REFRESH_TOKEN_SECRET',
  CREATE_USER_TOKEN_SECRET: 'CREATE_USER_TOKEN_SECRET',
  ACCESS_TOKEN_TTL: 'ACCESS_TOKEN_TTL',
  REFRESH_TOKEN_TTL: 'REFRESH_TOKEN_TTL',
  CREATE_USER_TOKEN_TTL: 'CREATE_USER_TOKEN_TTL',
} as const;

export const JWT_KEY_VALIDATOR = {
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  CREATE_USER_TOKEN_SECRET: Joi.string().required(),
  ACCESS_TOKEN_TTL: Joi.number().required(),
  REFRESH_TOKEN_TTL: Joi.number().required(),
  CREATE_USER_TOKEN_TTL: Joi.number().required(),
} as const;
