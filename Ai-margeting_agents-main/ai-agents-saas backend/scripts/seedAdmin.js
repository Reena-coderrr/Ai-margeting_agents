const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const User = require("../models/User")
require("dotenv").config()

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ai-agents-saas", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log("Connected to MongoDB")

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@aimarketing.com" })

    if (existingAdmin) {
      console.log("Admin user already exists")
      process.exit(0)
    }

    // Create admin user
    const adminUser = new User({
      firstName: "Admin",
      lastName: "User",
      email: "admin@aimarketing.com",
      phone: "+1234567890",
      password: "AdminPass123!@#",
      company: "AI Marketing Platform",
      role: "admin",
      subscription: {
        plan: "agency",
        status: "active",
        trialStartDate: new Date(),
        trialEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
      isActive: true,
      isEmailVerified: true,
      isPhoneVerified: true,
    })

    await adminUser.save()

    console.log("✅ Admin user created successfully")
    console.log("Email: admin@aimarketing.com")
    console.log("Password: AdminPass123!@#")

    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding admin:", error)
    process.exit(1)
  }
}

seedAdmin()