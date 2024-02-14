const express = require('express');
const { auth } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const listingValidation = require('../../validations/listing.validation');
const listingController = require('../../controllers/listing.controller');

const router = express.Router();

//host routes
router
  .route('/')
  .post(auth('manageEvents'), validate(listingValidation.createListing), listingController.createListing)
  .get(validate(listingValidation.getListings), listingController.getListings);

//serach the listing

// router.get('/search/:search',)

router
  .route('/:listingId')
  .get(auth('getEvents'), validate(listingValidation.getListing), listingController.getListing)
  .patch(auth('manageEvents'), validate(listingValidation.updateListing), listingController.updateListing)
  .delete(auth('manageEvents'), validate(listingValidation.deleteListing), listingController.deleteListing);

module.exports = router;
