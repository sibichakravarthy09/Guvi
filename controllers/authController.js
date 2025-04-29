const User = require('../models/User');

// Login function
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Plain text password comparison
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.role !== 'admin' && user.role !== 'lead') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({
      name: user.name,
      role: user.role,
    });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Register function (no bcrypt)
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Save password as plain text (not recommended for production)
    const user = new User({
      name,
      email,
      password,
      role,
    });

    await user.save();

    res.status(201).json({
      name: user.name,
      email: user.email,
      role: user.role,
    });

  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, register };
