const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const FacebookTokenStrategy = require('passport-facebook-token');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const GitHubTokenStrategy = require('passport-github-token');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

//passport-jwt
const jwtOptions = {
  secretOrKey: config.jwt.secret,
  // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    // console.log(payload);
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

// async function authenticateUserWithSocialProvider(provider, profile, done) {
//   try {
//     // Check if user has a valid email address
//     if (!profile.emails || !profile.emails[0].value) {
//       return done(null, false, { message: 'Please provide an email address to continue.' });
//     }

//     // Find user by social ID
//     const user = await User.findOne({ [`${provider}Id`]: profile.id });

//     if (user) {
//       // If user already exists, return user
//       return done(null, user);
//     } else {
//       // If user does not exist, find user by email
//       const userWithEmail = await User.findOne({ email: profile.emails[0].value });

//       if (userWithEmail) {
//         // If user with email exists, update user with social ID: one email in many login methods
//         userWithEmail[`${provider}Id`] = profile.id;
//         userWithEmail[`${provider}Name`] = profile.displayName;
//         userWithEmail.logInWith = provider;

//         // Save updated user to database
//         await userWithEmail.save();

//         return done(null, userWithEmail);
//       } else {
//         // If user with email does not exist, create new user
//         const newUser = new User();
//         newUser[`${provider}Id`] = profile.id;
//         newUser[`${provider}Name`] = profile.displayName;
//         newUser.email = profile.emails[0].value;
//         newUser.logInWith = provider;
//         newUser.role = ;

//         await newUser.save();

//         return done(null, newUser);
//       }
//     }
//   } catch (error) {
//     return done(error, false);
//   }
// }

//passport github token
const githubOptions = {
  clientID: config.github.clientID,
  clientSecret: config.github.clientSecret,
  scope: 'user:email',
};

const githubVerify = async (accessToken, refreshToken, profile, done) => {
  done(null, profile);
};

//passport facebook token
const facebookOptions = {
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.clientSecret,
  scope: 'user:email',
};

const facebookVerify = async (accessToken, refreshToken, profile, done) => {
  done(null, profile);
};

//passport google token
const googleOptions = {
  clientID: config.google.clientID,
  clientSecret: config.google.clientSecret,
};

const googleVerify = async (accessToken, refreshToken, profile, done) => {
  done(null, profile);
};

//User
const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
const githubStrategy = new GitHubTokenStrategy(githubOptions, githubVerify);
const facebookStrategy = new FacebookTokenStrategy(facebookOptions, facebookVerify);
const googleStrategy = new GooglePlusTokenStrategy(googleOptions, googleVerify);

module.exports = {
  jwtStrategy,
  githubStrategy,
  facebookStrategy,
  googleStrategy,
};
