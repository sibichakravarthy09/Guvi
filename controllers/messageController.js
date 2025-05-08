const Message = require("../models/Message");

// Create new enquiry (Customer)
exports.createMessage = async (req, res) => {
  try {
    const { title, propertyType, description, userId, userName } = req.body;

    // Simple validation
    if (!title || !propertyType || !description || !userId || !userName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newMessage = new Message({
      title,
      propertyType,
      description,
      userId,
      userName,
    });

    await newMessage.save();
    res.status(201).json({ message: "Message submitted successfully!" });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all messages (Admin only)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });

    if (!messages || messages.length === 0) {
      return res.status(404).json({ message: "No messages found" });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Reply to a message (Admin)
exports.replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    if (!reply) {
      return res.status(400).json({ error: "Reply is required" });
    }

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    message.reply = reply;
    await message.save();

    res.status(200).json({ message: "Reply sent successfully." });
  } catch (error) {
    console.error("Error replying to message:", error);
    res.status(500).json({ error: "Server error" });
  }
};
