const sendEmail = require("../config/email");

exports.sendNotification = async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    await sendEmail(to, subject, message);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending email", error });
  }
};
