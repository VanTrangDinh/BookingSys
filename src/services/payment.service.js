// const paypal = require('paypal-rest-sdk');
// paypal.configure({
//   mode: 'sandbox', //sandbox or live
//   client_id: 'AS4kyYtDx4gmtqeRove7jgpmzbLMPaWl0IMcSQ7OjSxGkdZQLWqkLL9hBYoXEZS8C2bDbcp8I8abcBQ-',
//   client_secret: 'EH9snA0m4nz6E7sAyBC8BF09NSCBVbvKFbCCVODnOJ_KuDmzsjhlmwwSROAmTDwxvFSPRgF7YWs0ER_a',
// });

// // API endpoint để tạo một thanh toán mới
// const create_payment_json = {
//   intent: 'sale',
//   payer: {
//     payment_method: 'paypal',
//   },
//   redirect_urls: {
//     return_url: 'http://localhost:3000/v1/payments/success',
//     cancel_url: 'http://localhost:3000/v1/payments/cancel',
//   },
//   transactions: [
//     {
//       item_list: {
//         items: [
//           {
//             name: 'Item Name',
//             sku: 'Item SKU',
//             price: '10.00',
//             currency: 'USD',
//             quantity: 1,
//           },
//         ],
//         //   params: params,
//       },
//       amount: {
//         currency: 'USD',
//         total: '10.00',
//       },
//       description: 'Payment description',
//     },
//   ],
// };

// const createPayment = paypal.payment.create(create_payment_json, (error, payment) => {
//   if (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   } else {
//     for (let i = 0; i < payment.links.length; i++) {
//       if (payment.links[i].rel === 'approval_url') {
//         res.status(200).json({ approval_url: payment.links[i].href });
//       }
//     }
//   }
// });

// // API endpoint để xử lý khi thanh toán thành công

// const execute_payment_json = {
//   payer_id: payerId,
//   transactions: [
//     {
//       amount: {
//         currency: 'USD',
//         total: '10.00',
//       },
//     },
//   ],
// };

// const execute = paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
//   if (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   } else {
//     console.log(JSON.stringify(payment));
//     res.status(200).json({ success: true });
//   }
// });

// module.exports = {
//   createPayment,
//   execute,
// };

// const httpStatus = require('http-status');
// const { Payment } = require('../models');
// const ApiError = require('../utils/ApiError');

// /**
//  * Create a user
//  * @param {Object} userBody
//  * @returns {Promise<User>}
//  */
// const cratePayment = async (userBody) => {
//     const { name, email, password } = userBody;
//     if (await User.isEmailTaken(userBody.email)) {
//       throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
//     }
//     const user = await User.create({
//       name,
//       email,
//       password,
//       role: 'host',
//     });
//     return user;
//   };

//   const createUser = async (userBody) => {
//     if (await User.isEmailTaken(userBody.email)) {
//       throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
//     }

//     return User.create(userBody);
//   };

//   /**
//    * Query for users
//    * @param {Object} filter - Mongo filter
//    * @param {Object} options - Query options
//    * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
//    * @param {number} [options.limit] - Maximum number of results per page (default = 10)
//    * @param {number} [options.page] - Current page (default = 1)
//    * @returns {Promise<QueryResult>}
//    */
//   const queryUsers = async (filter, options) => {
//     const users = await User.paginate(filter, options);
//     return users;
//   };

//   /**
//    * Get user by id
//    * @param {ObjectId} id
//    * @returns {Promise<User>}
//    */
//   const getUserById = async (id) => {
//     return User.findById(id);
//   };

//   /**
//    * Get user by email
//    * @param {string} email
//    * @returns {Promise<User>}
//    */
//   const getUserByEmail = async (email) => {
//     return User.findOne({ email });
//   };

//   /**
//    * Update user by id
//    * @param {ObjectId} userId
//    * @param {Object} updateBody
//    * @returns {Promise<User>}
//    */
//   const updateUserById = async (userId, updateBody) => {
//     const user = await getUserById(userId);
//     if (!user) {
//       throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//     }
//     if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
//       throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
//     }
//     Object.assign(user, updateBody);
//     await user.save();
//     return user;
//   };

//   /**
//    * Delete user by id
//    * @param {ObjectId} userId
//    * @returns {Promise<User>}
//    */
//   const deleteUserById = async (userId) => {
//     const user = await getUserById(userId);
//     if (!user) {
//       throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//     }
//     await user.remove();
//     return user;
//   };

//   module.exports = {
//     createUser,
//     createHost,
//     queryUsers,
//     getUserById,
//     getUserByEmail,
//     updateUserById,
//     deleteUserById,
//   };

const stripe = require('stripe')(
  'sk_test_51N6o3yJ0ZOu7tuDL7CQmEwRdnKWcwFsKqSxtd698iBMoGzZHYBtZVMlgPCDZkgyY7VLrWdUMwKiECBVjvpo9kc3I00J0eSRkQX'
);
//create new customer

var createCustomer = function () {
  var param = {};
  param.email = 'mike@gmail.com';
  param.name = 'Mikehahaha';
  param.description = 'from node';

  stripe.customers.create(param, function (err, customer) {
    if (err) {
      console.log('err: ' + err);
    }
    if (customer) {
      console.log('success: ' + customer);
    } else {
      console.log('Something wrong');
    }
  });
};

// createCustomer();

var retrieveCustomer = function () {
  stripe.customers.retrieve('cus_NsfQomQQsewbj0', function (err, customer) {
    if (err) {
      console.log('err: ' + err);
    }
    if (customer) {
      console.log('success: ' + JSON.stringify(customer, null, 2));
    } else {
      console.log('Something wrong');
    }
  });
};
// retrieveCustomer();

var createToken = function () {
  var param = {};
  param.card = {
    number: '4242424242424242',
    exp_month: 2,
    exp_year: 2024,
    cvc: '212',
  };

  stripe.tokens.create(param, function (err, token) {
    if (err) {
      console.log('err: ' + err);
    }
    if (token) {
      console.log('success: ' + JSON.stringify(token, null, 2));
    } else {
      console.log('Something wrong');
    }
  });
};
// createToken();

var addCardToCustomer = function () {
  stripe.customers.createSource('cus_NsfQomQQsewbj0', { source: 'tok_1N6u84J0ZOu7tuDLWvQsiQJT' }, function (err, card) {
    if (err) {
      console.log('err: ' + err);
    }
    if (card) {
      console.log('success: ' + JSON.stringify(card, null, 2));
    } else {
      console.log('Something wrong');
    }
  });
};

// addCardToCustomer();

var chargeCustomerThroughCustomerID = function () {
  var param = {
    amount: '2000',
    currency: 'usd',
    description: 'First payment',
    customer: 'cus_NsfQomQQsewbj0',
  };

  stripe.charges.create(param, function (err, charge) {
    if (err) {
      console.log('err: ' + err);
    }
    if (charge) {
      console.log('success: ' + JSON.stringify(charge, null, 2));
    } else {
      console.log('Something wrong');
    }
  });
};
// chargeCustomerThroughCustomerID();

var chargeCustomerThroughTokenID = function () {
  var param = {
    amount: '2000',
    currency: 'usd',
    description: 'First payment',
    source: 'tok_1N6uDoJ0ZOu7tuDLp7R5o2D4',
  };

  stripe.charges.create(param, function (err, charge) {
    if (err) {
      console.log('err: ' + err);
    }
    if (charge) {
      console.log('success: ' + JSON.stringify(charge, null, 2));
    } else {
      console.log('Something wrong');
    }
  });
};

// chargeCustomerThroughTokenID();

var getAllCustomers = function () {
  stripe.customers.list({ limit: 4 }, function (err, customers) {
    if (err) {
      console.log('err: ' + err);
    }
    if (customers) {
      console.log('success: ' + JSON.stringify(customers.data, null, 2));
    } else {
      console.log('Something wrong');
    }
  });
};

// getAllCustomers();
