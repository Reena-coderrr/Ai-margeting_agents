const jwt = require("jsonwebtoken")
const User = require("../models/User")

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log("[ADMIN AUTH] Decoded JWT:", decoded)
    } catch (err) {
      console.error("[ADMIN AUTH] JWT verification error:", err)
      return res.status(401).json({ message: "Token is not valid", error: err.message })
    }
    // Check if it's an admin token (hardcoded admin)
    if (decoded.role === "admin" && decoded.email) {
      req.admin = {
        email: decoded.email,
        role: decoded.role,
        loginTime: decoded.loginTime,
      }
      return next()
    }
    // Check if it's a user with admin role
    const userId = decoded.userId || decoded.id
    const user = await User.findById(userId).select("-password")
    if (!user) {
      console.log("[ADMIN AUTH] No user found for userId:", userId)
      return res.status(401).json({ message: "Token is not valid" })
    }
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." })
    }
    if (!user.isActive) {
      return res.status(401).json({ message: "Account is deactivated" })
    }
    req.user = user
    next()
  } catch (error) {
    console.error("Admin auth middleware error:", error)
    res.status(401).json({ message: "Token is not valid", error: error.message })
  }
}

module.exports = adminAuth 