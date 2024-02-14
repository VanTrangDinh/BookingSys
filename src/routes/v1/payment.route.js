const express = require('express');
const router = express.Router();

//test PAYPAL

const paypal = require('paypal-rest-sdk');
paypal.configure({
  mode: 'sandbox', //sandbox or live
  client_id: 'AS4kyYtDx4gmtqeRove7jgpmzbLMPaWl0IMcSQ7OjSxGkdZQLWqkLL9hBYoXEZS8C2bDbcp8I8abcBQ-',
  client_secret: 'EH9snA0m4nz6E7sAyBC8BF09NSCBVbvKFbCCVODnOJ_KuDmzsjhlmwwSROAmTDwxvFSPRgF7YWs0ER_a',
});

// Cấu hình tài khoản PayPal của bạn
// paypal.configure({
//   mode: 'sandbox', // sandbox hoặc live
//   client_id: 'YOUR_CLIENT_ID',
//   client_secret: 'YOUR_CLIENT_SECRET',
// });

// API endpoint để tạo một thanh toán mới

router.get('/', (req, res) => {
  const params = {}; // Create an empty object to store the parameters
  for (const paramName in req.query) {
    const paramValue = req.query[paramName];

    // Add the parameter to the object
    params[paramName] = paramValue;
  }
  console.log(params);
  // Do something with the parameter value
  const create_payment_json = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: 'http://localhost:3000/v1/payments/success',
      cancel_url: 'http://localhost:3000/v1/payments/cancel',
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: 'Item Name',
              sku: 'Item SKU',
              price: '10.00',
              currency: 'USD',
              quantity: 1,
            },
          ],
          //   params: params,
        },
        amount: {
          currency: 'USD',
          total: '10.00',
        },
        description: 'Payment description',
      },
    ],
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.status(200).json({ approval_url: payment.links[i].href });
        }
      }
    }
  });
});

// API endpoint để xử lý khi thanh toán thành công
router.get('/success', (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: 'USD',
          total: '10.00',
        },
      },
    ],
  };

  paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log(JSON.stringify(payment));
      res.status(200).json({ success: true });
    }
  });
});

// API endpoint để xử lý khi thanh toán bị hủy
router.post('/cancel', (req, res) => {
  res.status(200).json({ success: false });
});

// Khởi động server

module.exports = router;
//end test PAYPAL
