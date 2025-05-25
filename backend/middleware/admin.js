const User = require("../models/User")

// Middleware to check if user is an admin
exports.isAdmin = async (req, res, next) => {
  try {
    // req.user is set by the authenticateToken middleware
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." })
    }

    next()
  } catch (error) {
    console.error("Admin middleware error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
