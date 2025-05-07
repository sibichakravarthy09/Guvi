const express = require("express");
const router = express.Router();
const {
  createMessage,
  getAllMessages,
  replyToMessage,
} = require("../controllers/messageController");

// POST /api/messages – for customer to submit
router.post("/", createMessage);

// GET /api/messages – for admin to fetch all
router.get("/", getAllMessages);

// POST /api/messages/reply/:id – admin reply
router.post("/reply/:id", replyToMessage);

module.exports = router;
