const express = require("express");
const User = require("../models/User");
const Subscription = require("../models/Subscription");
const AIToolUsage = require("../models/AIToolUsage");
const Settings = require("../models/Settings");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// Admin login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Generate JWT (reuse logic from auth.js)
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        loginTime: Date.now(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({
      message: "Admin login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error during admin login" });
  }
});

// Get dashboard stats
router.get("/dashboard-stats", async (req, res) => {
  try {
    // Total users (all users)
    const totalUsers = await User.countDocuments();

    // Monthly revenue (dummy, replace with real logic if you have payment data)
    const monthlyRevenue = 0;

    // Active subscriptions
    const activeSubscriptions = await Subscription.countDocuments({ status: "active" });

    // API usage (dynamic)
    const apiUsage = await AIToolUsage.countDocuments();

    res.json({
      totalUsers,
      monthlyRevenue,
      activeSubscriptions,
      apiUsage,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats", error });
  }
});

// Get all users for user management table
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Get subscription breakdown
router.get("/subscriptions/overview", async (req, res) => {
  try {
    const plans = ["Free Trial", "Starter", "Pro", "Agency"];
    const breakdown = {};
    for (const plan of plans) {
      breakdown[plan] = await Subscription.countDocuments({ plan });
    }
    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subscription overview", error });
  }
});

// Get analytics (dummy, replace with real logic if you track analytics)
router.get("/analytics", async (req, res) => {
  try {
    // Real analytics
    const totalGenerations = await AIToolUsage.countDocuments();
    // Most popular tools
    const mostPopularTools = await AIToolUsage.aggregate([
      { $group: { _id: "$toolName", uses: { $sum: 1 } } },
      { $sort: { uses: -1 } },
      { $limit: 5 },
      { $project: { name: "$_id", uses: 1, _id: 0 } },
    ]);
    // Optionally, keep uptime/response time as dummy
    res.json({
      totalGenerations,
      uptime: 98.5,
      avgResponseTime: 2.3,
      mostPopularTools,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics", error });
  }
});

// Get all settings
router.get("/settings", adminAuth, async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching settings", error });
  }
});

// Update settings (admin only)
router.put("/settings", adminAuth, async (req, res) => {
  try {
    const { platform, userManagement, aiTools } = req.body;
    // Basic validation
    if (!platform || typeof platform !== "object") {
      return res.status(400).json({ message: "Invalid or missing platform settings" });
    }
    if (!userManagement || typeof userManagement !== "object") {
      return res.status(400).json({ message: "Invalid or missing userManagement settings" });
    }
    if (!aiTools || typeof aiTools !== "object") {
      return res.status(400).json({ message: "Invalid or missing aiTools settings" });
    }
    // Optionally, add more granular validation for subfields here
    const updated = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating settings", error });
  }
});

// Get user details
router.get("/users/:userId", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details", error });
  }
});

// Update user
router.put("/users/:userId", adminAuth, async (req, res) => {
  try {
    console.log('Update user request:', req.params.userId, req.body);
    console.log('Admin auth passed, user ID:', req.user.id);
    
    const { firstName, lastName, email, company, subscription } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) {
      console.log('User not found:', req.params.userId);
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log('Found user:', user.email);
    console.log('Updating with data:', { firstName, lastName, email, company, subscription });
    
    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (company !== undefined) user.company = company;
    
    await user.save();
    console.log('User saved successfully');
    
    // Update subscription if provided
    if (subscription && (subscription.plan || subscription.status)) {
      console.log('Updating subscription:', subscription);
      await Subscription.findOneAndUpdate(
        { userId: user._id },
        subscription,
        { new: true, upsert: true }
      );
      console.log('Subscription updated successfully');
    }
    
    // Return updated user data
    const updatedUser = await User.findById(req.params.userId).select("-password");
    console.log('Returning updated user:', updatedUser.email);
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
});

// Suspend/Unsuspend user account
router.post("/users/:userId/toggle-suspension", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Toggle suspension status
    user.isSuspended = !user.isSuspended;
    await user.save();
    
    const action = user.isSuspended ? "suspended" : "activated";
    res.json({ 
      message: `User account ${action} successfully`,
      isSuspended: user.isSuspended
    });
  } catch (error) {
    console.error('Toggle suspension error:', error);
    res.status(500).json({ message: "Error updating user suspension status", error: error.message });
  }
});

// Delete user account
router.delete("/users/:userId", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Delete user and related data
    await User.findByIdAndDelete(req.params.userId);
    await Subscription.findOneAndDelete({ userId: req.params.userId });
    await AIToolUsage.deleteMany({ userId: req.params.userId });
    
    res.json({ 
      message: "User account deleted successfully"
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: "Error deleting user account", error: error.message });
  }
});

module.exports = router;
