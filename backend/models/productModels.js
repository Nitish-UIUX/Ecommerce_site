// const mysql = require('mysql2');
const moongose = require('mongoose');

productSchema = new moongose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
        // maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please enter product description'],
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        maxLength: [8, 'Product name cannot exceed 5 characters'],
        default: 0.0
    },
    ratings: {
        type: Number,
        default: 0.0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category:{
        type: String,
        required: [true ,'Please Enter Category'],
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        maxLength: [4, 'Stock cannot exceed 4 characters'],
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews:[
        {
            user:{
                type: moongose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating:{
                type: Number,
                required: true
            },
            comment:{
                type: String,
                reuired: true
            } 
        }
    ],
    user:{
        type: moongose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createAt:{
        type: Date,
        default: Date.now
    },
});

module.exports = moongose.model("Product", productSchema);

