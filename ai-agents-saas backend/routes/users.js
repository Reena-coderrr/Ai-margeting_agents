const express = require("express")
const User = require("../models/User")
const AIToolUsage = require("../models/AIToolUsage")
const auth = require("../middleware/auth")
const { body, validationResult } = require("express-validator")

const router = express.Router()

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Calculate trial days remaining
    const trialDaysRemaining =
      user.subscription.status === "trial"
        ? Math.max(0, Math.ceil((user.subscription.trialEndDate - new Date()) / (1000 * 60 * 60 * 24)))
        : 0

    // Get available tools
    const availableTools = user.getAvailableTools()

    // Get recent activity
    const recentActivity = await AIToolUsage.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("toolName createdAt status")

    res.json({
      user: {
        ...user.toObject(),
        trialDaysRemaining,
        availableTools,
      },
      recentActivity,
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  "/profile",
  auth,
  [
    body("firstName").optional().trim().isLength({ min: 2 }),
    body("lastName").optional().trim().isLength({ min: 2 }),
    body("phone").optional().isMobilePhone(),
    body("company").optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { firstName, lastName, phone, company } = req.body

      const user = await User.findById(req.user.userId)
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      // Update fields if provided
      if (firstName) user.firstName = firstName
      if (lastName) user.lastName = lastName
      if (phone) user.phone = phone
      if (company !== undefined) user.company = company

      await user.save()

      // Remove password from response
      const userResponse = user.toObject()
      delete userResponse.password

      res.json({
        message: "Profile updated successfully",
        user: userResponse,
      })
    } catch (error) {
      console.error("Update profile error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// @route   GET /api/users/usage-stats
// @desc    Get user usage statistics
// @access  Private
router.get("/usage-stats", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Get current month usage
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const monthlyUsage = await AIToolUsage.countDocuments({
      userId: user._id,
      createdAt: { $gte: startOfMonth },
    })

    // Get tool usage breakdown
    const toolUsageStats = await AIToolUsage.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: "$toolName",
          count: { $sum: 1 },
          lastUsed: { $max: "$createdAt" },
        },
      },
      { $sort: { count: -1 } },
    ])

    // Get usage over time (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const dailyUsage = await AIToolUsage.aggregate([
      {
        $match: {
          userId: user._id,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    res.json({
      totalGenerations: user.usage.totalGenerations,
      monthlyGenerations: monthlyUsage,
      toolUsageStats,
      dailyUsage,
      subscription: {
        plan: user.subscription.plan,
        status: user.subscription.status,
        trialDaysRemaining:
          user.subscription.status === "trial"
            ? Math.max(0, Math.ceil((user.subscription.trialEndDate - new Date()) / (1000 * 60 * 60 * 24)))
            : 0,
      },
    })
  } catch (error) {
    console.error("Get usage stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/users/change-password
// @desc    Change user password
// @access  Private
router.post(
  "/change-password",
  auth,
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { currentPassword, newPassword } = req.body

      const user = await User.findById(req.user.userId)
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      // Verify current password
      const isMatch = await user.comparePassword(currentPassword)
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" })
      }

      // Update password
      user.password = newPassword
      await user.save()

      res.json({ message: "Password changed successfully" })
    } catch (error) {
      console.error("Change password error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

module.exports = router
