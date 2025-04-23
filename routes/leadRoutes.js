const express = require("express");
const router = express.Router();
const { isLead } = require("../middlewares/authMiddleware");
const { getAllLeads } = require("../controllers/leadController");

// Leads can only view assigned leads
router.get("/leads", isLead, getAllLeads);

module.exports = router;
