const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.cookie('refreshToken', tokens.refresh.token, {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000,
  });
  // res.setHeader('Authorization', tokens.access.token);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  // await authService.logout(req.body.refreshToken);
  // res.status(httpStatus.NO_CONTENT).send();
  const refreshToken = req.cookies.refreshToken;
  console.log(refreshToken);
  await authService.logout(refreshToken);
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
  });
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  console.log(req.user);
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

//user

const logInWithGoogle = catchAsync(async (req, res) => {
  // authenticateUserWithSocialProvider('google', req.user, req.body.role, async (err, user) => {
  //   if (err) {
  //     return res.status(400).json({ message: err.message });
  //   }

  //   const token = await tokenService.generateAuthTokens(user);
  //   console.log({ user, token });
  //   res.setHeader('Authorization', token.access.token);
  //   return res.status(httpStatus.CREATED).send({ user, token });
  // });

  const user = await authService.logInUserWithSocialProvider('google', req.user, req.body.role);
  const token = await tokenService.generateAuthTokens(user);
  res.setHeader('Authorization', token.access.token);
  return res.status(httpStatus.CREATED).send({ user, token });
});
const logInWithFacebook = catchAsync(async (req, res) => {
  const user = await authService.logInUserWithSocialProvider('facebook', req.user, req.body.role);
  const token = await tokenService.generateAuthTokens(user);
  res.setHeader('Authorization', token.access.token);
  return res.status(httpStatus.CREATED).send({ user, token });
});

const logInWithGithub = catchAsync(async (req, res) => {
  const user = await authService.logInUserWithSocialProvider('github', req.user, req.body.role);
  const token = await tokenService.generateAuthTokens(user);
  res.setHeader('Authorization', token.access.token);
  return res.status(httpStatus.CREATED).send({ user, token });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  logInWithGoogle,
  logInWithFacebook,
  logInWithGithub,
};
