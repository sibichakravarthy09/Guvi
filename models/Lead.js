const mongoose = require('mongoose');
const LeadSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  status: { type: String, enum: ['new', 'contacted', 'converted', 'lost'], default: 'new' },
});

module.exports = mongoose.model('Lead', LeadSchema)