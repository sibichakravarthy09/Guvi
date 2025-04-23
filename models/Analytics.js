const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema({
  totalLeads: Number,
  totalSales: Number,
  totalCustomers: Number,
  taskCompletionRate: Number,
  salesByStage: [
    {
      stage: String,
      value: Number,
    },
  ],
  topCustomers: [
    {
      name: String,
      value: Number,
    },
  ],
  monthlyRevenue: [
    {
      month: String,
      revenue: Number,
    },
  ],
  reportDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Analytics", AnalyticsSchema);
