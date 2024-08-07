// const app = require('./app');
// const mysql = require('mysql2');

// // const port = process.env.PORT || 4000;

// const dotenv = require('dotenv');
// // const cloudinary = require('cloudinary');
// const connectDatabase = require('./config/database');

// //configuring dotenv
// dotenv.config({ path: 'backend/config/config.env' });

// console.log("POrt No is" +process.env.PORT);

// //connecting to database
// connectDatabase();

// //setting up cloudinary configuration
// // cloudinary.config({
// //     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// //     api_key: process.env.CLOUDINARY_API_KEY, 
// //     api_secret: process.env.CLOUDINARY_API_SECRET
// // });


// app.listen(process.env.PORT, () => {
//     console.log(`Listening on port http://localhost: ${process.env.PORT}`);
// });

// // app.listen(process.env.PORT || 5000, () => {
// //     console.log(`Listening on port ${process.env.PORT || 5000}`);
// // });




const app = require("./app");
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "config/config.env" });
}

// Connecting to database
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    });
});