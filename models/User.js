const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  role: { type: String, enum: ['admin', 'lead', 'user'], required: true }, // Added 'user' as a default role option
  password: { type: String, required: true }, // Added password field
});

// Create a model using the schema
module.exports = mongoose.model('User', UserSchema);
