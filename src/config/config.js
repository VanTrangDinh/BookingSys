const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    FACEBOOK_CLIENT_ID: Joi.string().description('the facebook client id'),
    FACEBOOK_CLIENT_SECRET: Joi.string().description('the facebook client secret'),
    GOOGLE_CLIENT_ID: Joi.string().description('the google client id'),
    GOOGLE_CLIENT_SECRET: Joi.string().description('the google client secret'),
    GOOGLE_MAIL_CLIENT_ID: Joi.string().description('the google client id'),
    GOOGLE_MAIL_CLIENT_SECRET: Joi.string().description('the google client secret'),
    GITHUB_CLIENT_ID: Joi.string().description('the github client id'),
    GITHUB_CLIENT_SECRET: Joi.string().description('the github client secret'),
    REDIRECT_URI: Joi.string().description('the redirect URI'),
    REFRESH_TOKEN: Joi.string().description('nothing'),
    GMAIL_USERNAME: Joi.string().description('username for gmail server'),
    GMAIL_FROM: Joi.string().description('the from field in the gmails sent by the app'),
    PAYPAL_CLIENT_ID: Joi.string().description('the paypal client'),
    PAYPAL_CLIENT_SECRET: Joi.string().description('the paypal client secret'),
    PAYPAL_MODE: Joi.string().description('the paypal mode'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  gmail: {
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: envVars.GMAIL_USERNAME,
      clientId: envVars.GOOGLE_MAIL_CLIENT_ID,
      clientSecret: envVars.GOOGLE_MAIL_CLIENT_SECRET,
      redirectUri: envVars.REDIRECT_URI,
      refreshToken: envVars.REFRESH_TOKEN,
    },
    from: envVars.GMAIL_FROM,
  },
  facebook: {
    clientID: envVars.FACEBOOK_CLIENT_ID,
    clientSecret: envVars.FACEBOOK_CLIENT_SECRET,
  },
  google: {
    clientID: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET,
  },
  github: {
    clientID: envVars.GITHUB_CLIENT_ID,
    clientSecret: envVars.GITHUB_CLIENT_SECRET,
  },
  paypal: {
    clientID: envVars.PAYPAL_CLIENT_ID,
    clientSecret: envVars.PAYPAL_CLIENT_SECRET,
    mode: envVars.PAYPAL_MODE,
  },
};
