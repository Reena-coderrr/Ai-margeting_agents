const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
require("dotenv").config()

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in the environment variables. Please set it in your .env file.");
}

const app = express()

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use("/api/", limiter)

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err))

// Import Routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const adminRoutes = require("./routes/admin")
const subscriptionRoutes = require("./routes/subscriptions")
const aiToolRoutes = require("./routes/aiTools")
const analyticsRoutes = require("./routes/analytics")

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/admin", require("./routes/admin"));
app.use("/api/subscriptions", subscriptionRoutes)
app.use("/api/ai-tools", aiToolRoutes)
app.use("/api/analytics", analyticsRoutes)

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Environment: ${process.env.NODE_ENV || "development"}`)
})