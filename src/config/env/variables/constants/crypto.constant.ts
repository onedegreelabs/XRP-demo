import * as Joi from 'joi';

export const CRYPTO_KEY = {
  XRPL_NODE: 'XRPL_NODE',
} as const;

export const CRYPTO_KEY_VALIDATOR = {
  XRPL_NODE: Joi.string().required(),
} as const;
