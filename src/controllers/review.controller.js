const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { reviewService } = require('../services');

const createReview = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const { listingId, rating, comment } = req.body;
  const review = await reviewService.createReview(_id, listingId, rating, comment);
  res.status(httpStatus.CREATED).json(review);
});

const getReviewsByListing = catchAsync(async (req, res) => {
  const { listingId } = req.query;
  const reviews = await reviewService.getListingReviews(listingId);
  res.status(httpStatus.OK).json(reviews);
});

// const getReviewsByUser = catchAsync(async (req, res) => {
//   const { userId } = req.query;
//   console.log(userId);
//   const reviews = await reviewService.getUserReviews(userId);
//   res.status(httpStatus.OK).json(reviews);
// });

const updateReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  const review = await reviewService.updateReview(reviewId, rating, comment);
  res.status(httpStatus.OK).json(review);
});

const deleteReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  await reviewService.deleteReview(reviewId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createReview,
  getReviewsByListing,
  // getReviewsByUser,
  updateReview,
  deleteReview,
};
