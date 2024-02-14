const httpStatus = require('http-status');
const { Listing } = require('../models');
const ApiError = require('../utils/ApiError');

const createListing = async (listingBody, id) => {
  const listing = await Listing.create({ ...listingBody, host: id });
  return listing;
};

/**
 * Query for Listings
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryListings = async (filter, options) => {
  const listings = await Listing.paginate(filter, options);
  return listings;
};

/**
 * Get Listing by id
 * @param {ObjectId} id
 * @returns {Promise<Listing>}
 */
const getListingById = async (id) => {
  return Listing.findById(id);
};

/**
 * Update Listing by id
 * @param {ObjectId} ListingId
 * @param {Object} updateBody
 * @returns {Promise<Listing>}
 */
const updateListingById = async (listingId, updateBody) => {
  const listing = await getListingById(listingId);
  if (!listing) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Listing not found');
  }
  Object.assign(listing, updateBody);
  await listing.save();
  return listing;
};

/**
 * Delete listing by id
 * @param {ObjectId} listingId
 * @returns {Promise<Listing>}
 */
const deleteListingById = async (listingId) => {
  const listing = await getListingById(listingId);
  if (!listing) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Listing not found');
  }
  await listing.remove();
  return listing;
};

/**
 * search listing by keySearch
 * @param {ObjectId} listingId
 * @returns {Promise<Listing>}
 */
const getListSearchListing = async (keySearch) => {
  // return await searchProductByuser({ keySearch });

  const regexSearch = new RegExp(keySearch);
  const results = await Listing.find(
    {
      isPublished: true,
      $text: { $search: regexSearch },
    },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .lean();
  return results;
};
module.exports = {
  createListing,
  queryListings,
  getListingById,
  updateListingById,
  deleteListingById,
  getListSearchListing,
};
