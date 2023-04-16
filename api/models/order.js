// connect to mongoose for db connections
const mongoose = require('mongoose');

// create a table connection
const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  quantity: Number,
});

module.exports = mongoose.model('Order', orderSchema);
