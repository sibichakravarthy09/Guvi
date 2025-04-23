const User = require('../models/User');

const login = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Only allow admin and lead to log in
    if (user.role !== 'admin' && user.role !== 'lead') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Login success
    res.status(200).json({
      name: user.name,
      role: user.role,
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login };
