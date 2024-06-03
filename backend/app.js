const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const cookieParser = require('cookie-parser');

const errorMiddleware = require('./middleWare/error');

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Route imports
const product = require('./routes/productRoutes');
const user = require('./routes/userRoutes');
const order = require('./routes/orderRoutes');

app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);



// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;
