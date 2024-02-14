const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const reservationsRoute = require('./reservations.route');
const hostRoute = require('./host.route');
const paymentRoute = require('./payment.route');
const listingRoute = require('./listing.route');
const docsRoute = require('./docs.route');
const reviewRoute = require('./review.route');
const chatRoute = require('./chat.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/reviews',
    route: reviewRoute,
  },
  {
    path: '/reservations',
    route: reservationsRoute,
  },
  {
    path: '/host',
    route: hostRoute,
  },
  {
    path: '/payments',
    route: paymentRoute,
  },
  {
    path: '/listings',
    route: listingRoute,
  },
  {
    path: '/chat',
    route: chatRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
