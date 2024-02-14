const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { listingService, elasticsearchService } = require('../services');

const createListing = catchAsync(async (req, res) => {

  const { _id } = req.user;
 


  const listing = await listingService.createListing(req.body, _id);
  res.status(httpStatus.CREATED).send(listing);
});

const getListings = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'address']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await listingService.queryListings(filter, options);
  res.send(result);
});

const getListing = catchAsync(async (req, res) => {
  const listing = await listingService.getListingById(req.params.listingId);
  if (!listing) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Listing not found');
  }
  res.send(listing);
});

const updateListing = catchAsync(async (req, res) => {
  const listing = await listingService.updateListingById(req.params.listingId, req.body);
  res.send(listing);
});

const deleteListing = catchAsync(async (req, res) => {
  await listingService.deleteListingById(req.params.listingId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createListing,
  getListings,
  getListing,
  updateListing,
  deleteListing,
};
