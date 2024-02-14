const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  console.log({ user: user });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  console.log(refreshToken);
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

const logInUserWithSocialProvider = async (provider, profile, role) => {
  try {
    // Check if user has a valid email address
    if (!profile.emails || !profile.emails[0].value) {
      throw new Error('Please provide an email address to continue.');
    }

    // Find user by social ID
    const user = await User.findOne({ [`${provider}Id`]: profile.id });

    if (user) {
      // If user already exists, check user role
      if (user.role !== role && role !== undefined) {
        // If user is a host, update user role
        user.role = role;
        await user.save();
        return user;
      } else {
        // If user is not a host, return user
        return user;
      }
    } else {
      // If user does not exist, find user by email
      const userWithEmail = await User.findOne({ email: profile.emails[0].value });

      if (userWithEmail) {
        // If user with email exists, update user with social ID: one email in many login methods
        userWithEmail[`${provider}Id`] = profile.id;
        userWithEmail[`${provider}Name`] = profile.displayName;
        userWithEmail.logInWith = provider;

        // Save updated user to database
        await userWithEmail.save();

        // Check user role
        if (userWithEmail.role === 'host') {
          // If user is a host, return user with host role
          return { ...userWithEmail.toObject(), role: 'host' };
        } else {
          // If user is not a host, return user with user role
          return { ...userWithEmail.toObject(), role: 'user' };
        }
      } else {
        // If user with email does not exist, create new user
        const newUser = new User();
        newUser[`${provider}Id`] = profile.id;
        newUser[`${provider}Name`] = profile.displayName;
        newUser.email = profile.emails[0].value;
        newUser.logInWith = provider;
        newUser.role = role;

        await newUser.save();

        return { user: newUser };
      }
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  logInUserWithSocialProvider,
};
