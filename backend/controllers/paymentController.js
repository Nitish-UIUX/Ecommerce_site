// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const Product = require('../models/productModels');
// const Order = require('../models/orderModels');
// const User = require('../models/userModel');
// // const ErrorHandler = require('../utils/errorHandler');
// // const catchAsyncErrors = require('../middleWare/catchAsyncErrors');

// // Process stripe payment
// exports.processPayment = async (req, res, next) => {
//     const paymentIntent = await stripe.paymentIntents.create({
//         amount: req.body.amount,
//         currency: 'inr',

//         metadata: { 
//            company: 'Ecommerce',
//         },
//     });

//     res.status(200).json({
//         success: true,
//         client_secret: paymentIntent.client_secret
//     })
// }

// // Send stripe API Key
// exports.sendStripeApiKey = async (req, res, next) => {
//     res.status(200).json({
//         stripeApiKey: process.env.STRIPE_API_KEY
//     })
// }


const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});