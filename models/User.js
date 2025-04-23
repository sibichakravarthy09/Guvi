const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  role: { type: String, enum: ['admin', 'lead'], required: true },
});

module.exports = mongoose.model('User', UserSchema);