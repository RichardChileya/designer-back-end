/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const express = require('express');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productsRoutes = require('./api/routes/products.js');
const orderRoutes = require('./api/routes/orders.js');

mongoose.connect(`mongodb+srv://richardchileyawk:${process.env.MONGO_ATLAS_PW}@designer-back-end.ox332sk.mongodb.net/test`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS ERROR
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorozation');
  if (req.method === 'OPTIONS') {
    req.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'PATCH', 'DELETE', 'GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/products', productsRoutes);
app.use('/orders', orderRoutes);

// ERROR HANDLING
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;