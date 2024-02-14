const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

// USING OAUTH2
const { google } = require('googleapis');
const oAuth2Client = new google.auth.OAuth2(
  config.gmail.auth.clientId,
  config.gmail.auth.clientSecret,
  config.gmail.auth.redirectUri
);
oAuth2Client.setCredentials({ refresh_token: config.gmail.auth.refreshToken });

const sendGmail = async (to, subject, text) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: config.gmail.service,
      auth: {
        type: config.gmail.auth.type,
        user: config.gmail.auth.user,
        clientId: config.gmail.auth.clientId,
        clientSecret: config.gmail.auth.clientSecret,
        refreshToken: config.gmail.auth.refreshToken,
        accessToken: accessToken,
      },
    });

    //send mail with defined transport object and mailOptions
    const mailOptions = {
      from: '"Fred Foo 👻" <workdvt811212@gmail.com>',
      to: to,
      subject: subject,
      text: text,
    };

    const result = await transport.sendMail(mailOptions);
    console.log(result);
    return result;
  } catch (error) {
    logger.error(error);
  }
};

/* sendGmail('dinhtrang811212@gmail.com', 'check mail', 'check mail')
  .then((result) => console.log('result: ', result))
  .catch((error) => console('error', error)); */

//USING SMTP
const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendGmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://localhost:3000/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendGmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendGmail,
};
