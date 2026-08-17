import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),

  HTTP_PORT: Joi.number()
    .integer()
    .min(1)
    .max(65535)
    .default(3000),

  LOG_LEVEL: Joi.string()
    .valid('log', 'error', 'warn', 'debug', 'verbose', 'fatal')
    .default('log'),

  USER_GRPC_HOST: Joi.string()
    .trim()
    .required(),

  USER_GRPC_PORT: Joi.number()
    .integer()
    .min(1)
    .max(65535)
    .required(),

  CATALOG_GRPC_HOST: Joi.string()
    .trim()
    .required(),

  CATALOG_GRPC_PORT: Joi.number()
    .integer()
    .min(1)
    .max(65535)
    .required(),

  GRPC_CALL_TIMEOUT_MS: Joi.number()
    .integer()
    .positive()
    .default(5000),

  GRPC_HEALTH_TIMEOUT_MS: Joi.number()
    .integer()
    .positive()
    .default(2000),
});