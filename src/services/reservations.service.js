const httpStatus = require('http-status');
const { Reservation, Listing } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Creates a new reservation for a given room and user
 * @param {String} listingId - The ID of the room to reserve
 * @param {String} userId - The ID of the user making the reservation
 * @param {Date} checkIn - The check-in date of the reservation
 * @param {Date} checkOut - The check-out date of the reservation
 * @returns {Object} - The newly created reservation or an error object
 */

async function createReservation(reservationBody, userId) {
  const { listingId, numGuests } = reservationBody;
  const checkIn = new Date(reservationBody.checkIn);
  const checkOut = new Date(reservationBody.checkOut);

  const listing = await Listing.findById(listingId);

  if (!listing) {
    throw new Error('Listing not found');
  }
  if (checkIn >= checkOut) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Check-in date must be before check-out date');
  }
  const bookingConflict = await Reservation.find({
    // (5  11) (11   15)
    listingId: listingId,
    status: { $ne: 'completed' }, //    (1 (3  (5) 6) (7)   10) ) 11)  (11     15)  (16 18 )   (20  25)
    $or: [
      { checkIn: { $gte: checkIn, $lte: checkOut } },
      { checkOut: { $gte: checkIn, $lte: checkOut } },
      {
        $and: [{ checkIn: { $lte: checkIn } }, { checkOut: { $gte: checkOut } }],
      },
    ],
  }).countDocuments();

  if (bookingConflict > 0) {
    return { error: 'The listing is not available for the given dates' };
  }

  // Check if the user has any reservations that overlap with the proposed dates
  const userReservations = await Reservation.find({
    user: userId,
    status: { $ne: 'completed' },
    $or: [
      { checkIn: { $gte: checkIn, $lte: checkOut } },
      { checkOut: { $gte: checkIn, $lte: checkOut } },
      {
        $and: [{ checkIn: { $lte: checkIn } }, { checkOut: { $gte: checkOut } }],
      },
    ],
  }).countDocuments();

  if (userReservations > 0) {
    return { error: 'You already have a reservation that overlaps with the proposed dates' };
  }

  // Calculate the reservation total based on the listing's price and the number of nights
  const numNights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
  const totalPrice = numNights * listing.price;

  // Create the reservation
  const reservation = new Reservation({
    user: userId,
    listingId: listingId,
    checkIn,
    checkOut,
    numGuests,
    totalPrice,
    paid: false,
  });

  // Save the reservation to the database
  await reservation.save();

  // Add the reservation to the listing's reservations array
  await Listing.findByIdAndUpdate(listingId, { $push: { bookings: reservation._id } });

  return { reservation };
}

/**
 * Retrieves a reservation for a given user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Reservation>} The reservation object.
 * @throws {ApiError} When the reservation is not found.
 */

async function getReservationsForUser(userId) {
  const reservation = await Reservation.findOne({
    user: userId,
    status: { $ne: 'completed' },
  })
    .populate({
      path: 'listingId',
      select: '-bookings', // Exclude the bookings field from the populated listing
    })
    .populate('payments')
    .exec();
  if (!reservation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reservation not found');
  }
  return reservation;
}

/**
 * Retrieves reservations for a given host.
 * @param {string} hostId - The ID of the host.
 * @returns {Promise<Array<Reservation>>} An array of reservation objects.
 * @throws {ApiError} When no reservations are found.
 */
async function getReservationsByHost(hostId) {
  const listings = await Listing.find({ host: hostId }).select('_id');

  const reservationIds = listings.map((listing) => listing._id);

  const reservations = await Reservation.find({ listingId: { $in: reservationIds } })
    .populate({
      path: 'listingId',
      select: '-bookings', // Exclude the bookings field from the populated listing
    })
    .exec();
  if (!reservations) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reservation not found');
  }
  return reservations;
}

/**
 * Cancels a reservation.
 * @param {string} reservationId - The ID of the reservation to cancel.
 * @param {string} userId - The ID of the user initiating the cancellation.
 * @returns {Promise<Reservation>} The updated reservation object after cancellation.
 * @throws {Error} When the reservation is not found or cannot be cancelled.
 */

async function cancelReservation(reservationId, userId) {
  const reservation = await Reservation.findById(reservationId, userId);
  if (!reservation) {
    throw new Error('Reservation not found');
  }

  if (reservation.status !== 'pending') {
    throw new Error('Reservation cannot be cancelled');
  }

  reservation.status = 'cancelled';
  await reservation.save();

  return reservation;
}

/**
 * Deletes a reservation.
 * @param {string} reservationId - The ID of the reservation to delete.
 * @param {string} userId - The ID of the user initiating the deletion.
 * @returns {Promise<Reservation>} The deleted reservation object.
 * @throws {ApiError} When the reservation is not found, the user is not authorized, or the reservation cannot be deleted.
 */

async function deleteReservation(reservationId, userId) {
  // Check if the reservation exists
  const reservation = await Reservation.findOne({
    _id: reservationId,
    user: userId,
    status: { $ne: 'completed' },
  });
  // const reservation = await Reservation.findById(reservationId);
  console.log(reservation);
  if (!reservation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reservation not found');
  }

  // Check if the user is authorized to delete the reservation
  if (reservation.user.toString() !== userId.toString()) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized to delete this reservation');
  }

  if (reservation.status !== 'cancelled') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Reservation cannot be deleted');
  }
  // Check if the reservation has been paid for
  // if (reservation.paid) {
  //   throw new ApiError(httpStatus.FORBIDDEN, 'This reservation has already been paid for and cannot be deleted');
  // }

  // Remove the reservation from the database
  reservation.status = 'completed';

  await reservation.save();
  // await reservation.remove();

  // Remove the reservation from the listing's reservations array
  await Listing.findByIdAndUpdate(reservation.listingId, { $pull: { bookings: reservation._id } });

  return reservation;
}

/**
 * Confirms a reservation.
 * @param {string} reservationId - The ID of the reservation to confirm.
 * @returns {Promise<Reservation>} The confirmed reservation object.
 * @throws {Error} When the reservation is not found or is already confirmed.
 */

async function confirmReservation(reservationId) {
  // Check if reservation exists
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) {
    throw new Error('Reservation not found');
  }

  // Check if reservation is already confirmed
  if (reservation.status === 'confirmed') {
    throw new Error('Reservation is already confirmed');
  }

  // Update reservation status to 'confirmed'
  reservation.status = 'confirmed';
  await reservation.save();

  // Perform any additional actions or notifications related to the reservation confirmation

  return reservation;
}

/**
 * Retrieves reservations for a specific host and listing.
 * @param {string} hostId - The ID of the host.
 * @param {string} listingId - The ID of the listing.
 * @returns {Promise<Reservation[]>} An array of reservations for the host and listing.
 * @throws {Error} When failed to retrieve reservations.
 */

async function getReservationsForHostListing(hostId, listingId) {
  try {
    const reservations = await Reservation.find({ host: hostId, listing: listingId });
    return reservations;
  } catch (error) {
    console.error('Error retrieving reservations:', error);
    throw new Error('Failed to retrieve reservations');
  }
}

module.exports = {
  createReservation,
  deleteReservation,
  getReservationsForUser,
  cancelReservation,
  confirmReservation,
  getReservationsByHost,
};

/**
 *  A user submits a reservation request for a listing by providing the check-in and check-out dates and number of guests.
    Airbnb calculates the total price of the reservation based on the listing's nightly rate and any additional fees or taxes.
    The user must then provide payment information and authorize Airbnb to charge their payment method.
    Airbnb pre-authorizes the payment method to ensure that the funds are available, but does not actually charge the user until the host accepts the reservation request.
    Airbnb notifies the host of the reservation request and provides them with the details of the reservation.
    The host has 24 hours to accept or decline the reservation request.
    If the host accepts the reservation request, Airbnb charges the user's payment method and holds the funds in escrow until the guest checks in.
    On the day of check-in, Airbnb releases the payment to the host. If there are any issues during the stay, the guest can contact Airbnb for support and resolution.
 */
