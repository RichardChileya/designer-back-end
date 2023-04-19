// connect to mongoose for db connections
const mongoose = require('mongoose');

// create a table connection
const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String,
         required: true,
          unique: true,
           match: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
           },
  address: { type: String, required: true },
  role: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
