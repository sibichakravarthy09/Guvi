const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: false  // optional assignment
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  date: {
    type: Date,
    default: Date.now  // optional: adds creation timestamp
  }
});

module.exports = mongoose.model('Task', TaskSchema);
