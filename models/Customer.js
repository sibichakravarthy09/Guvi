const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sale' }],
});

module.exports = mongoose.model('Customer', CustomerSchema);
