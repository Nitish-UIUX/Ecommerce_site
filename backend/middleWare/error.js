// const ErrorHandler = require('../utils/errorHandler');

// module.exports = (err, req, res, next) => {
//     err.statusCode = err.statusCode || 500;
//     err.message = err.message || 'Internal Server Error';

//     res.status(err.statusCode).json({
//         success:false,
//         error: err
//     })
// }

// error.js
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    //Wrong Mongoose Object ID Error
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid: ${err.path}`;
      err = new ErrorHandler(message, 400);
    }

    //MongoDb duplicate key error
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      err = new ErrorHandler(message, 400);
    }

    //Wrong JWT error
    if(err.name === "JsonWebTokenError"){
      const message = "Json Web Token is invalid. Try Again!!!";
      err = new ErrorHandler(message, 400);
    }

    //Expired JWT error
    if(err.name === "TokenExpiredError"){
      const message = "Json Web Token is expired. Try Again!!!";
      err = new ErrorHandler(message, 400);
    }
  
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
};
  
