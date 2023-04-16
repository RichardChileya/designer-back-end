/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();

// GET METHOD
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Orders were fetched',
  });
});

// Post METHOD
router.post('/', (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity,
  };

  res.status(201).json({
    message: 'Orders created',
    createdOrder: order,
  });
});

// GET  ID METHOD
router.get('/:orderId', (req, res, next) => {
  res.status(201).json({
    message: 'Orders details',
    orderId: req.params.orderId,
  });
});

// DELETE METHOD
router.delete('/:orderId', (req, res, next) => {
  res.status(201).json({
    message: 'Order Deleted',
    orderId: req.params.orderId,
  });
});
// GET METHOD
router.patch('/:orderId', (req, res, next) => {
  res.status(201).json({
    message: 'Order Updated ',
    orderId: req.params.orderId,
  });
});

module.exports = router;