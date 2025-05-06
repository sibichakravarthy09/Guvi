const User = require("../models/User");

// Auth Middleware: Ensures the user is authenticated and registered
const authMiddleware = async (req, res, next) => {
  const email = req.headers.email || req.body.email || req.query.email;

  if (!email) {
    return res.status(401).json({ message: "Unauthorized: No Email Provided" });
  }

  try {
    // Check if the user exists
    let user = await User.findOne({ email });

    // If user doesn't exist, register them as a "user" by default
    if (!user) {
      const { role = 'user' } = req.body;  // Default to 'user' for non-privileged users
      user = new User({ email, role });
      await user.save();
    }

    // Attach the user object to the request so it can be used later in the route
    req.user = user;
    next();  // Proceed to the next middleware/route handler
  } catch (error) {
    console.error("❌ Error in authMiddleware:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Role-based middlewares: Ensures only users with specific roles can access certain routes

// Admin-only route middleware
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  console.log("✅ Admin Access Granted:", req.user.email);
  next();
};

// Lead-only route middleware
const isLead = (req, res, next) => {
  if (!req.user || req.user.role !== "lead") {
    return res.status(403).json({ message: "Access denied: Leads only" });
  }
  console.log("✅ Lead Access Granted:", req.user.email);
  next();
};

// Admin or Lead access (used for routes that require either admin or lead)
const isAdminOrLead = (req, res, next) => {
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "lead")) {
    return res.status(403).json({ message: "Access denied: Admins or Leads only" });
  }
  console.log("✅ Admin or Lead Access Granted:", req.user.email);
  next();
};

// User or Admin access (used for routes that allow both users and admins)
const isUserOrAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "user")) {
    return res.status(403).json({ message: "Access denied: Users and Admins only" });
  }
  console.log("✅ User or Admin Access Granted:", req.user.email);
  next();
};

module.exports = { authMiddleware, isAdmin, isLead, isAdminOrLead, isUserOrAdmin };
