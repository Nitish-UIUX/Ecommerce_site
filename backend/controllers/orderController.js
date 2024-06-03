const Order = require('../models/orderModels');
const Product = require('../models/productModels');
// const ErrorHandler = require('../utils/errorHandler');
// const ApiFeatures = require('../utils/apiFeatures');

// Create a new order => /api/v1/order/new
exports.newOrder = async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    });

    res.status(201).json({
        success: true,
        order,
    })
}

// Get Single Order => /api/v1/order/:id
exports.getSingleOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order Not Found with this Id',
        })
        // return next(new ErrorHandler("Order not found with this Id", 404));
    }

    res.status(200).json({
        success: true,
        order
    })
}

// Get logged in user orders => /api/v1/orders/me
exports.myOrders = async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders
    })
}

// Get all orders - ADMIN => /api/v1/admin/orders/
exports.getAllOrders = async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount = totalAmount + order.totalPrice;
        console.log(totalAmount);
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
}

// Update Order Status- ADMIN => /api/v1/admin/order/:id
exports.updateOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order Not Found with this Id',
        })
        // return next(new ErrorHandler("Order not found with this Id", 404));
    }

    if (order.orderStatus === 'Delivered') {
        return res.status(400).json({
            success: false,
            message: 'You have already delivered this order'
        })
    }

    order.orderItems.forEach(async order => {
        await updateStock(order.product, order.quantity);
    });

    order.orderStatus = req.body.status,
        order.deliveredAt = Date.now();

    if (req.body.status === 'Delivered') {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        order
    })
}

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;

    await product.save({ validateBeforeSave: false });
}

// Delete Order - ADMIN => /api/v1/admin/order/:id
exports.deleteOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order Not Found with this Id',
        })
        // return next(new ErrorHandler("Order not found with this Id", 404));
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Order is deleted'
    })
}