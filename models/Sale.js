const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema({
  dealName: { type: String, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }, 
  customerName: { type: String },// change from ObjectId to string
  property: String,
  amount: { type: Number, required: true },
  stage: { 
    type: String, 
    enum: ["Lead", "Qualified", "Proposal", "Negotiation", "Closed"], 
    default: "Lead" 
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Sale", SaleSchema);
