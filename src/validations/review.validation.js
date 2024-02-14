const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { Review } = require('../models');

const getReviews = {
  query: Joi.object().keys({
    rating: Joi.number().integer(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId),
  }),
};

const createReview = {
  body: Joi.object().keys({
    guest: Joi.string().custom(objectId),
    listing: Joi.string().custom(objectId),
    comment: Joi.string().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
  }),
};

const deleteReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId).custom((value, helper) => {
    onst
    }),
  }),
};

module.exports = {
  createReview,
  getReviews,
  getReview,
  deleteReview,
};
