const express = require('express');
const validate = require('../../middlewares/validate');
const { auth } = require('../../middlewares/auth');
const reviewValidation = require('../../validations/review.validation');
const reviewController = require('../../controllers/review.controller');

const router = express.Router();

router.route('/').post(auth(), reviewController.createReview).get(reviewController.getReviewsByListing);

router
  .route('/:reviewId')
  .patch(auth('manageUsers'), reviewController.updateReview)
  .delete(auth('manageUsers'), reviewController.deleteReview);

// router.route('/:userId').get(reviewController.getReviewsByUser);

module.exports = router;
