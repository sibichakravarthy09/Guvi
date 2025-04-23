const mongoose = require ("mongoose");

const EmailSchema = new mongoose.Schema({
    sender: String,
    recipient: String,
    subject: String,
    message: String,
    dateSent: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Email', EmailSchema)
