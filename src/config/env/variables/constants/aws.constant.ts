import * as Joi from 'joi';

export const AWS_S3_KEY = {
  S3_ACCESS_KEY: 'S3_ACCESS_KEY',
  S3_SECRET_KEY: 'S3_SECRET_KEY',
  S3_BUCKET_REGION: 'S3_BUCKET_REGION',
  S3_BUCKET_NAME: 'S3_BUCKET_NAME',
  CDN_URL: 'CDN_URL',
} as const;

export const AWS_S3_KEY_VALIDATOR = {
  S3_ACCESS_KEY: Joi.string().required(),
  S3_SECRET_KEY: Joi.string().required(),
  S3_BUCKET_REGION: Joi.string().required(),
  S3_BUCKET_NAME: Joi.string().required(),
  CDN_URL: Joi.string().required(),
} as const;

export const AWS_SES_KEY = {
  SES_ACCESS_KEY: 'SES_ACCESS_KEY',
  SES_SECRET_KEY: 'SES_SECRET_KEY',
  SES_REGION: 'SES_REGION',
  SES_DOMAIN: 'SES_DOMAIN',
} as const;

export const AWS_SES_KEY_VALIDATOR = {
  SES_ACCESS_KEY: Joi.string().required(),
  SES_SECRET_KEY: Joi.string().required(),
  SES_REGION: Joi.string().required(),
  SES_DOMAIN: Joi.string().required(),
} as const;
