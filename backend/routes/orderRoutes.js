const express = require('express');
const router = express.Router();

const {isAuthenticatedUser, authorizeRoles} = require('../middleWare/auth');

const {newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder} = require('../controllers/orderController');

// API for new Order
router.post('/order/new', isAuthenticatedUser, newOrder);

// API for get single Order
router.get('/order/:id', isAuthenticatedUser, getSingleOrder);

// API for get logged in user orders
router.get('/orders/me', isAuthenticatedUser ,myOrders);

// API for get all orders - ADMIN
router.get('/admin/orders', isAuthenticatedUser, authorizeRoles('admin'), getAllOrders);

// API for update order status - ADMIN
router.put('/admin/order/:id', isAuthenticatedUser, authorizeRoles('admin'), updateOrder);

// API for delete order - ADMIN
router.delete('/admin/order/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);

module.exports = router;