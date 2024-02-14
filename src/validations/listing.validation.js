const Joi = require('joi');
const { objectId } = require('../validations/custom.validation');
const createListing = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    address: Joi.string().required(),
    description: Joi.string().required(),
    accommodates: Joi.number().required(),
    bedrooms: Joi.number().required(),
    beds: Joi.number().required(),
    price: Joi.number().required(),
    maxGuests: Joi.number().required(),
    bathrooms: Joi.number().required(),
  }),
};

const getListings = {
  query: Joi.object().keys({
    name: Joi.string(),
    address: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getListing = {
  params: Joi.object().keys({
    listingId: Joi.string().custom(objectId),
  }),
};

const updateListing = {
  params: Joi.object().keys({
    listingId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      address: Joi.string().required(),
      summary: Joi.string().required(),
      house_rules: Joi.string().required(),
      property_type: Joi.string().required(),
      room_type: Joi.string(),
      bed_type: Joi.string(),
      minimum_nights: Joi.number(),
      maximum_nights: Joi.number(),
      cancellation_policy: Joi.string(),
      accommodates: Joi.number(),
      bedrooms: Joi.number(),
      beds: Joi.number(),
      price: Joi.number(),
      security_deposit: Joi.number(),
      cleaning_fee: Joi.number(),
      extra_people: Joi.number(),
    })
    .min(1),
};

const deleteListing = {
  params: Joi.object().keys({
    listingId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createListing,
  getListings,
  getListing,
  updateListing,
  deleteListing,
};
