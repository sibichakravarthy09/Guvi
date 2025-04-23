 const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  // Try getting email from headers, body, or query
  const email = req.headers.email || req.body.email || req.query.email;

  console.log("🔹 Received Headers:", req.headers);
  console.log("🔹 Extracted Email:", email);

  if (!email) {
    return res.status(401).json({ message: "Unauthorized: No Email Provided" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("🚨 User Not Found:", email);
      return res.status(401).json({ message: "Unauthorized: User Not Found" });
    }

    // Block users who are not admin or lead
    if (user.role !== "admin" && user.role !== "lead") {
      console.log("🚫 Unauthorized Role:", user.role);
      return res.status(403).json({ message: "Access denied: Unauthorized role" });
    }

    // Attach user to request for later use
    req.user = user;
    console.log("✅ Authenticated:", user.email, "| Role:", user.role);
    next();
  } catch (error) {
    console.error("❌ Error in authMiddleware:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  console.log("✅ Admin Access Granted:", req.user.email);
  next();
};

const isLead = (req, res, next) => {
  if (!req.user || req.user.role !== "lead") {
    return res.status(403).json({ message: "Access denied: Leads only" });
  }
  console.log("✅ Lead Access Granted:", req.user.email);
  next();
};

const isAdminOrLead = (req, res, next) => {
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "lead")) {
    return res.status(403).json({ message: "Access denied" });
  }
  console.log("✅ Admin or Lead Access Granted:", req.user.email);
  next();
};

module.exports = { authMiddleware, isAdmin, isLead, isAdminOrLead };
