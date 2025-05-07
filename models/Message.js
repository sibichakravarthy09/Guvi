const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  title: String,
  propertyType: String,
  description: String,
  userId: mongoose.Schema.Types.ObjectId,
  userName: String,
  reply: String, // optional field
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
