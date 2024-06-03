const mongoose = require("mongoose");

// require("mongoose").Promise = require("bluebird");

// var Promise = require("bluebird");

const connectDatabase = () => {
    mongoose.connect("mongodb://127.0.0.1:27017/ecommerce", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.log(`Connected to database `);
        }).catch((err) => {
            console.log(err);
        });
};


module.exports = connectDatabase;



