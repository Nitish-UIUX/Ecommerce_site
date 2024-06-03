const moongose = require('mongoose');

orderSchema = new moongose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: [true, 'Please enter your city name']
        },
        phoneNo: {
            type: String,
            required: [true, 'Please enter your phone number']
        },
        postalCode: {
            type: String,
            required: [true, 'Please enter your postal code']
        },
        country: {
            type: String,
            required: [true, 'Please enter your country name']
        },
    },

    orderItems: [
        {
            product: {
                type: moongose.Schema.ObjectId,
                ref: 'Product',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: String,
                required: true
            },
            image: {
                type: String,
                required: true
            },
        }
    ],

    user: {
        type: moongose.Schema.ObjectId,
        ref: 'User',
        required: true
    },

    paymentInfo: {
        id: {
            type: String,
        },
        status: {
            type: String,
        }
    },

    paidAt: {
        type: Date
    },

    itemsPrice: {
        type: Number,
        default: 0.0
    },

    taxPrice: {
        type: Number,
        default: 0.0
    },

    shippingPrice: {
        type: Number,
        default: 0.0
    },

    totalPrice: {
        type: Number,
        default: 0.0
    },

    orderStatus: {
        type: String,
        required: true,
        default: 'Processing'
    },

    deliveredAt: {
        type: Date
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = moongose.model('Order', orderSchema);