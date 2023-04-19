/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order.js');
const product = require('../models/product.js');

// GET ALL METHOD
router.get('/', (req, res, next) => {
  Order.find()
    .select('_id product quantity')
    .populate('product')
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        Orders: docs.map((doc) => ({
          _id: doc.id,
          product: {
            _id: doc.product.id,
            name: doc.product.name,
          },
          quantity: doc.quantity,
          request: {
            type: 'GET',
            url: `http://localhost:3000/orders/${doc.id}`,
          },
        })),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Post METHOD
router.post('/', (req, res, next) => {
  product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: 'Product ID not found',
        });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order
        .save()
        .then((result) => {
          res.status(201).json({
            message: `Order ${result.id} created successfully`,
            createdOrder: {
              _id: result.id,
              product: result.product,
              quantity: result.quantity,
            },
            request: {
              type: 'GET',
              url: `http://localhost:3000/orders/${result.id}`,
            },
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: 'Ptoduct Not Found',
        error: err,
      });
    });
});

// GET  ID METHOD
router.get('/:orderId', (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: 'Order not found, might be deleted!',
        });
      }
      return res.status(200).json({
        order: {
          _id: order.id,
          product: {
            _id: order.product.id,
            name: order.product.name,
            price: order.product.price,
          },
          quantity: order.quantity,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/orders',
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Internal Server Error',
        error: err,
      });
    });
});

// DELETE METHOD
router.delete('/:orderId', (req, res, next) => {
  Order.deleteOne({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      res.status(201).json({
        message: 'Order Deleted',
        request: {
          type: 'POST',
          description: 'Add another entry',
          url: 'http://localhost:3000/orders',
          body: { productId: 'ID', quantity: 'Number' },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'An error occured',
        error: err,
      });
    });
});
// PATCH METHOD
router.patch('/:OrderId', (req, res, next) => {
  const id = req.params.OrderId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Order.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: `Order ${id} updated successfully`,
        request: {
          type: 'GET',
          url: `http://localhost:3000/orders/${id}`,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;