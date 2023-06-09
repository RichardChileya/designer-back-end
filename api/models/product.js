const mongoose = require('mongoose');

// conect table to mongodb
const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true, maxlength: 100 },
  price: { type: Number, required: true },
  productImage: {type: String, required: true},
});

// export schema model
module.exports = mongoose.model('Product', productSchema);
