const httpStatus = require('http-status');
const Review = require('../models/review.model');
const Reservation = require('../models/reservations.model');
const Listing = require('../models/listings.model');
const ApiError = require('../utils/ApiError');

// Create a new review
const createReview = async (userId, listingId, rating, comment) => {
  const reservation = await Reservation.findOne({
    listingId,
    user: userId,
    status: 'completed',
    reviews: false,
  });
  if (!reservation)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User has not made a completed reservation or not reservation available or reviewed'
    );
  // update reservation
  reservation.reviews = true;
  await reservation.save();

  const review = new Review({
    user: userId,
    listingId: listingId,
    rating,
    comment,
  });
  await review.save();
  // Update the listing with the new average rating
  const listing = await Listing.findById(listingId);
  if (listing.average_rating === 0) {
    listing.average_rating = rating;
  } else {
    listing.average_rating = (listing.average_rating + rating) / 2;
  }
  await listing.save();
  await Listing.findByIdAndUpdate(listingId, { $push: { reviews: review } });

  return review;
};

// Get all reviews for a Listing
/**
 * The function retrieves and logs all reviews for a given listing ID.
 * @param listingId - The `listingId` parameter is a unique identifier for a specific listing. It is
 * used to query the database for all reviews associated with that particular listing.
 * @returns The function `getListingReviews` is returning an array of reviews that match the
 * `listingId` parameter. The function also logs the reviews to the console.
 */
const getListingReviews = async (listingId) => {
  const reviews = await Review.find({ listingId: listingId });
  console.log(reviews);
  return reviews;
};

// Get all reviews by a user
// const getUserReviews = async (userId) => {
//   const reviews = await Review.find({ user: userId }).populate('listingDetails');
//   return reviews;
// };

// Update a review
/**
 * This function updates a review with a new rating and comment and returns the updated review.
 * @param reviewId - The ID of the review that needs to be updated.
 * @param rating - The new rating value that will be updated in the review document.
 * @param comment - The `comment` parameter is a string that represents the updated comment for a
 * review. It is used in the `updateReview` function to update the `comment` field of a review document
 * in the database.
 * @returns The `updateReview` function returns a Promise that resolves to the updated `review` object.
 */
const updateReview = async (reviewId, rating, comment) => {
  const review = await Review.findByIdAndUpdate(reviewId, { rating, comment }, { new: true });
  return review;
};

// Delete a review
const deleteReview = async (reviewId) => {
  await Review.findByIdAndDelete(reviewId);
};

module.exports = {
  createReview,
  getListingReviews,
  // getUserReviews,
  updateReview,
  deleteReview,
};
