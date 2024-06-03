const express = require('express');
const { processPayment } = require('../controllers/paymentController');
const router = express.Router();

const {isAuthenticatedUser, authorizeRoles} = require('../middleWare/auth');
const{processPayment , sendStripeApiKey } = require('../controllers/paymentController');

// API for process payment
router.post('/payment/process', isAuthenticatedUser, processPayment);

// API for send stripe API Key
router.get('/stripeapi', isAuthenticatedUser, sendStripeApiKey);

module.exports = router;