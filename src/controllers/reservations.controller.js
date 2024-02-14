const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { reservationService } = require('../services');

/**
 *   createReservation,
  deleteReservation,
  getReservationsForUser,
  cancelReservation,
 */
const createReservation = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const reservation = await reservationService.createReservation(req.body, _id);
  res.status(httpStatus.CREATED).send(reservation);
});

// const getReservationsForUser = catchAsync(async (req, res) => {
//   const filter = pick(req.query, ['name', 'role']);
//   const options = pick(req.query, ['sortBy', 'limit', 'page']);
//   const result = await reservationService.queryReservation(filter, options);
//   res.send(result);
// });

const getReservation = catchAsync(async (req, res) => {
  const reservation = await reservationService.getReservationsForUser(req.user._id);
  console.log(reservation);

  res.status(httpStatus.OK).send(reservation);
});
const getReservationsByHost = catchAsync(async (req, res) => {
  const { _id } = req.user;
  console.log(_id);
  const reservations = await reservationService.getReservationsByHost(_id);
  console.log(reservations);
  res.status(httpStatus.OK).send(reservations);
});
// const getUsers = catchAsync(async (req, res) => {
//   const filter = pick(req.query, ['name', 'role', 'slug']);
//   const options = pick(req.query, ['sortBy', 'limit', 'page']);
//   const result = await userService.queryUsers(filter, options);
//   res.send(result);
// });
const cancelReservation = catchAsync(async (req, res) => {
  const reservation = await reservationService.updateReservationById(req.params.reservationId, req.user._id);
  res.status(httpStatus.OK).send(reservation);
});
const deleteReservation = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const { reservationId } = req.params;
  const reservation = await reservationService.deleteReservation(reservationId, _id);
  console.log(reservation);
  res.status(httpStatus.NO_CONTENT).send();
});
const confirmReservation = catchAsync(async (req, res) => {
  const { reservationId } = req.params;
  const reservation = await reservationService.confirmReservation(reservationId);
  res.status(httpStatus.OK).send(reservation);
});

module.exports = {
  createReservation,
  getReservation,
  cancelReservation,
  deleteReservation,
  confirmReservation,
  getReservationsByHost,
};
