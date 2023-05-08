const mongoose = require('mongoose');

// conect table to mongodb
const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true, maxlength: 100 },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  productImage: { type: String, required: true },
  status: { type: Boolean, required: true, default: 0 },
});

// export schema model
module.exports = mongoose.model('Product', productSchema);
