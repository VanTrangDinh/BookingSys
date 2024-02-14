const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const slugify = require('slugify');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    slug: String,
    dayOfBirth: {
      type: Date,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      // required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    logInWith: {
      type: String,
      enum: ['local', 'facebook', 'google', 'github'],
      default: 'local',
    },
    // google
    googleId: {
      type: String,
      default: null,
    },
    googleName: {
      type: String,
      default: null,
    },
    // fb
    facebookId: {
      type: String,
      default: null,
    },
    facebookName: {
      type: String,
      default: null,
    },
    // linkedin
    //github
    githubId: {
      type: String,
      default: null,
    },
    githubName: {
      type: String,
      default: null,
    },
    about: {
      type: String,
      default: null,
    },
    modified: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

// Pre-save middleware to generate slug
userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('name')) return next();

  const slug = slugify(user.name, {
    lower: true,
    strict: true,
  });
  user.slug = slug;
  next();
});
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  try {
    if (this.logInWith !== 'local') next();
    const user = this;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
  } catch (error) {}
  next(error);
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
