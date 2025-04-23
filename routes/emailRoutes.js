const express = require("express");
const { sendNotification } = require("../controllers/emailController");
const router = express.Router();

// POST send email notification
router.post("/send", sendNotification);

module.exports = router;
