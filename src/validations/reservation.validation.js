const Joi = require('joi');
const { objectId, date } = require('./custom.validation');

const createReservation = {
  body: Joi.object().keys({
    listingId: Joi.string().required().custom(objectId),
    checkIn: Joi.date().required(),
    checkOut: Joi.date().required(),
    numGuests: Joi.number().required(),
  }),
};

const getReservation = {
  params: Joi.object().keys({
    reservationId: Joi.string().custom(objectId),
  }),
};

const cancelReservation = {
  params: Joi.object().keys({
    reservationId: Joi.string().custom(objectId),
  }),
};

const deleteReservation = {
  params: Joi.object().keys({
    reservationId: Joi.string().custom(objectId),
  }),
};

const confirmReservation = {
  params: Joi.object().keys({
    reservationId: Joi.string().custom(objectId),
  }),
};

const getReservationsByHost = {
  params: Joi.object().keys({
    hostId: Joi.string().custom(objectId),
    listingId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createReservation,
  getReservation,
  cancelReservation,
  deleteReservation,
  confirmReservation,
  getReservationsByHost,
};
