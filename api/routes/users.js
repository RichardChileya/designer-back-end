/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.js');

// GET ALL USERS METHOD
router.get('/', (req, res, next) => {
  User.find()
    .select('_id name email address role')
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// POST (Create a New User)
router.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'this email already exists, please signin',
        });
      }
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            message: 'password error',
            error: err,
          });
        }
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          name: req.body.name,
          password: hash, // Use the hashed password
          email: req.body.email,
          address: req.body.address,
          role: req.body.role,
        });
        user.save()
          .then((result) => {
            res.status(201).json({
              message: `You have  signed Successfully`,
              createdUser: {
                _id: result.id, // Use the correct property name
                name: result.name,
                email: result.email,
                address: result.address,
                role: result.role,
              },
            });
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
            });
          });
        // Fix the closing parentheses here
      });
    })
    .catch();
});

// LOGIN ROUTE
router.post('/login', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }

      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed',
          });
        }

        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0].id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            },
          );

          return res.status(200).json({
            message: 'Auth successful',
            token,
          });
        }

        res.status(401).json({
          message: 'Auth failed',
        });
      });
    })
    .catch();
});

router.delete('/:userId', (req, res, next) => {
  User.deleteOne({ _id: req.params.userId })
    .exec()
    .then(() => {
      res.status(200).json({
        message: 'User deleted successfully',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/users/signup',
          body: {
            name: 'String', email: 'String', password: 'String', address: 'String', role: 'Boolean',
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Un error occured when deleting',
        error: err,
      });
    });
});

module.exports = router;
