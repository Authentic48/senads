import * as Joi from '@hapi/joi';
export const configSchema = Joi.object({
  // app
  NODE_ENV: Joi.string().required(),
  APP_NAME: Joi.string().required(),
  APP_PORT: Joi.string().required(),
  // DB
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_HOST: Joi.string().required(),
  // smtp
  TRANSPORT_NAME: Joi.string().required(),
  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.number().required(),
  MAIL_USERNAME: Joi.string().required(),
  MAIL_PASSWORD: Joi.string().required(),
  MAIL_FROM_ADDRESS: Joi.string().required(),
  // redis
  REDIS_MAIN_DB: Joi.string().required(),
  REDIS_URL: Joi.string().required(),
  // otp
  OTP_LIFE_TIME: Joi.number().required(),
  RESEND_OTP_LIFE_TIME: Joi.number().required(),
  DEFAULT_CODE: Joi.number().required(),
  // jwt
  USER_SESSION_LIMIT: Joi.number().required(),
  JWT_SECRET: Joi.string().required(),
  ACCESS_TOKEN_LIFE_TIME: Joi.number().required(),
  REFRESH_TOKEN_LIFE_TIME: Joi.number().required(),
  VERIFY_OTP_TOKEN_LIFE_TIME: Joi.number().required(),
});
