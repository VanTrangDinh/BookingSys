const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Define a virtual property to populate user and property details
reviewSchema.virtual('userDetails', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true,
});

reviewSchema.virtual('listingDetails', {
  ref: 'Listing',
  localField: 'listing',
  foreignField: '_id',
  justOne: true,
});

reviewSchema.plugin(toJSON);
reviewSchema.plugin(paginate);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
