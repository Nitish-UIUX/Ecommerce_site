const Product = require('../models/productModels');
const ErrorHandler = require('../utils/errorHandler');
const ApiFeatures = require('../utils/apiFeatures');

const fs = require('fs');
const path = require('path');
const e = require('express');

//-----------------Create new product --admin---------------------

exports.createProduct = async (req, res, next) => {

    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
}

// -------------------------Get all product---------
// exports.getAllProduct = async (req, res) => {

//     // see the result in one page
//     const resultPerPage = 4;

//     // total number of products which is helpful in our frontend dashboard to show the total number of products
//     const productCount = await Product.countDocuments();



// Function to get all products
exports.getAllProduct = async (req, res) => {
    try {

        const resultPerPage = 8;
        const productsCount = await Product.countDocuments();
        const features = new ApiFeatures(Product.find(), req.query)
            .search()
            .filter()
            .pagination(resultPerPage);
            

        const products = await features.query;

        res.status(200).json({
            success: true,
            count: products.length,
            products,
            resultPerPage,
            productsCount
        });
    } catch (error) {
        console.error(error); // Log the error to the console
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Get All Product (Admin)
exports.getAdminProducts = async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
};

// Update product -- Admin
exports.updateProduct = async (req, res) => {

    let product = await Product.findById(req.params.id);
    if (!product) {
        res.status(500).json({
            success: false,
            message: 'Product Not Found',
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        product
    })
}

// Delete product -- Admin
exports.deleteProduct = async (req, res) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        res.status(500).json({
            success: false,
            message: 'Product Not Found'
        })
    }
    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Product is deleted'
    })
}

// Get single product details
exports.getProductDetails = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        // return next(new ErrorHandler('Product Not Found', 404));
        return res.status(500).json({
            success: false,
            message: 'Product Not Found'
        })
    }
    res.status(200).json({
        success: true,
        product,
        // productCount

    })
}

// Create new review or update the review
exports.createProductReview = async (req, res) => {

    const { rating, comment, productId } = req.body;

    // create review object
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    // find the product
    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        rev => rev.user.toString() === req.user._id.toString()
    )

    // check if the user already review the product
    if (isReviewed) {
        // update the review
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })
    }
    else {
        // push the review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    // calculate the average rating
    product.ratings = product.reviews.forEach(review => {
        avg += review.rating;
    });
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })
}

// Get all Reviews of a product
exports.getProductReviews = async (req, res) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return res.status(500).json({
            success: false,
            message: 'Product Not Found'
        })
        // return next(new ErrorHandler('Product Not Found', 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
}

// Delete Product Review
exports.deleteProductReviews = async (req, res) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return res.status(500).json({
            success: false,
            message: 'Product Not Found'
        })
        // return next(new ErrorHandler('Product Not Found', 404));
    }

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());

    let avg = 0;

    reviews.forEach(review => {
        avg += review.rating;
    })

    const ratings = avg / reviews.length;

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
}

exports.uploadProductImage = async (req, res, next) => {
    // Access the uploaded files using req.files (plural) for express-fileupload.
    const files = req.files.fileName;
    console.log(files);

    // Handle the file upload here, including saving it to the desired directory with a unique filename.
    // For example, you can generate a unique filename with Date.now() and the original filename.
    const uniqueFileName = Date.now() + '-' + files.name;

    // Save the uploaded file with the unique filename to your specified directory.
    files.mv('D:/Aikyam/MERN Project/backend/images/' + uniqueFileName, (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'File upload failed',
                error: err
            });
        }

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully'
        });
    });
}

// // Functionn for Remove Image
// exports.removeProductImage = async (req, res, next) => {
//     const { fileName } = req.query;
//     console.log(fileName);

//     // Construct the full file path to delete the image
//     const filePath = path.join('D:/Aikyam/MERN Project/backend/images/', fileName);

//     fs.unlink(filePath, (err) => {
//         if (err) {
//             return res.status(500).json({
//                 success: false,
//                 message: 'File removal failed',
//                 error: err
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'Image deleted successfully'
//         });
//     });
// };




