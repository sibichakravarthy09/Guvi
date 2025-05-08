const express = require("express");
const router = express.Router();
const {
  createMessage,
  getAllMessages,
  replyToMessage,
} = require("../controllers/messageController");

// POST /api/messages – for customer to submit a new message
router.post("/", createMessage);

// GET /api/messages – for admin to fetch all messages
router.get("/", getAllMessages);

// PUT /api/messages/:id/reply – admin replying to a specific message
router.put("/:id/reply", replyToMessage); // Updated route path
module.exports = router;
