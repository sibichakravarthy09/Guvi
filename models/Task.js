const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
});

module.exports = mongoose.model('Task', TaskSchema);
