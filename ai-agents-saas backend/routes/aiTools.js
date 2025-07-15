const express = require("express")
const User = require("../models/User")
const AIToolUsage = require("../models/AIToolUsage")
const auth = require("../middleware/auth")
const rateLimit = require("express-rate-limit")

const router = express.Router()

// Rate limiting for AI tool usage
const toolLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each user to 10 requests per minute
  message: { message: "Too many requests, please try again later." },
})

// AI Tools configuration
const AI_TOOLS = {
  "seo-audit": {
    name: "SEO Audit Tool",
    description: "Comprehensive website SEO analysis",
    category: "SEO",
    freeInTrial: true,
  },
  "social-media": {
    name: "Social Media Content Generator",
    description: "Generate engaging social media posts",
    category: "Content",
    freeInTrial: true,
  },
  "blog-writing": {
    name: "Blog Writing & Optimization",
    description: "AI-powered long-form content creation",
    category: "Content",
    freeInTrial: false,
  },
  "email-marketing": {
    name: "Email Marketing Agent",
    description: "Create compelling email campaigns",
    category: "Email",
    freeInTrial: false,
  },
  "client-reporting": {
    name: "Client Reporting Agent",
    description: "Automated monthly reports with KPI analysis",
    category: "Analytics",
    freeInTrial: false,
  },
  "ad-copy": {
    name: "Ad Copy Generator",
    description: "High-converting ad creatives",
    category: "Advertising",
    freeInTrial: false,
  },
  "landing-page": {
    name: "Landing Page Builder Assistant",
    description: "Auto-generate compelling landing page copy",
    category: "Conversion",
    freeInTrial: false,
  },
  "competitor-analysis": {
    name: "Competitor Analysis Agent",
    description: "Deep competitor insights and SWOT analysis",
    category: "Research",
    freeInTrial: false,
  },
  "cold-outreach": {
    name: "Cold Outreach Personalization",
    description: "Personalized outreach messages",
    category: "Outreach",
    freeInTrial: false,
  },
  "reels-scripts": {
    name: "Reels/Shorts Scriptwriter",
    description: "Engaging short-form video scripts",
    category: "Video",
    freeInTrial: false,
  },
  "product-launch": {
    name: "Product Launch Agent",
    description: "Complete launch campaign planning",
    category: "Launch",
    freeInTrial: false,
  },
  "blog-to-video": {
    name: "Blog-to-Video Agent",
    description: "Convert blog content into video scripts",
    category: "Video",
    freeInTrial: false,
  },
  "local-seo": {
    name: "Local SEO Booster",
    description: "Optimize local search visibility",
    category: "Local SEO",
    freeInTrial: false,
  },
}

// Middleware to check tool access
const checkToolAccess = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId)
    const toolId = req.params.toolId || req.body.toolId

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const availableTools = user.getAvailableTools()

    if (!availableTools.includes(toolId)) {
      return res.status(403).json({
        message: "Tool not available in your current plan",
        availableTools,
        requiredPlan: AI_TOOLS[toolId]?.freeInTrial ? "free_trial" : "pro",
      })
    }

    // Check if trial expired for trial users
    if (user.subscription.status === "trial" && user.isTrialExpired()) {
      return res.status(403).json({
        message: "Free trial has expired. Please upgrade to continue using AI tools.",
        trialExpired: true,
      })
    }

    req.user.userData = user
    next()
  } catch (error) {
    console.error("Check tool access error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// @route   GET /api/ai-tools
// @desc    Get available AI tools for user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const availableTools = user.getAvailableTools()

    const toolsWithAccess = Object.entries(AI_TOOLS).map(([id, tool]) => ({
      id,
      ...tool,
      hasAccess: availableTools.includes(id),
      isTrialTool: tool.freeInTrial,
    }))

    res.json({
      tools: toolsWithAccess,
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
    console.error("Get AI tools error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/ai-tools/:toolId/generate
// @desc    Use AI tool to generate content
// @access  Private
router.post("/:toolId/generate", auth, toolLimiter, checkToolAccess, async (req, res) => {
  const startTime = Date.now()

  try {
    const { toolId } = req.params
    const { input } = req.body
    const user = req.user.userData

    if (!AI_TOOLS[toolId]) {
      return res.status(404).json({ message: "AI tool not found" })
    }

    if (!input) {
      return res.status(400).json({ message: "Input data is required" })
    }

    // Simulate AI processing (replace with actual AI API calls)
    const output = await simulateAIGeneration(toolId, input)

    const processingTime = Date.now() - startTime

    // Log usage with debug output
    console.log("Tool usage attempt:", {
      userId: user._id,
      toolId,
      toolName: AI_TOOLS[toolId].name,
      input,
      output,
      processingTime,
      status: "success",
    });
    try {
      await AIToolUsage.create({
        userId: user._id,
        toolId,
        toolName: AI_TOOLS[toolId].name,
        input,
        output,
        processingTime,
        status: "success",
      });
      console.log("Tool usage successfully logged!");
    } catch (err) {
      console.error("Error saving tool usage:", err);
    }

    // Update user usage stats
    user.usage.totalGenerations += 1
    user.usage.monthlyGenerations += 1

    // Update tool-specific usage
    const toolUsage = user.usage.toolsUsed.find((t) => t.toolId === toolId)
    if (toolUsage) {
      toolUsage.usageCount += 1
      toolUsage.lastUsed = new Date()
    } else {
      user.usage.toolsUsed.push({
        toolId,
        toolName: AI_TOOLS[toolId].name,
        usageCount: 1,
        lastUsed: new Date(),
      })
    }

    await user.save()

    res.json({
      success: true,
      output,
      processingTime,
      usage: {
        totalGenerations: user.usage.totalGenerations,
        monthlyGenerations: user.usage.monthlyGenerations,
      },
    })
  } catch (error) {
    console.error("AI tool generation error:", error)

    // Log failed usage
    await AIToolUsage.create({
      userId: req.user.userId,
      toolId: req.params.toolId,
      toolName: AI_TOOLS[req.params.toolId]?.name || "Unknown",
      input: req.body.input,
      output: null,
      processingTime: Date.now() - startTime,
      status: "error",
      errorMessage: error.message,
    })

    res.status(500).json({ message: "AI generation failed", error: error.message })
  }
})

// Mock AI generation function (replace with actual AI API calls)
async function simulateAIGeneration(toolId, input) {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

  const mockOutputs = {
    "seo-audit": {
      score: Math.floor(Math.random() * 40) + 60,
      issues: [
        "Missing meta description on 3 pages",
        "Page load speed could be improved",
        "Some images missing alt text",
      ],
      recommendations: [
        "Add meta descriptions to all pages",
        "Optimize images for faster loading",
        "Improve internal linking structure",
      ],
      report_url: "https://example.com/seo-report.pdf",
    },
    "social-media": {
      posts: [
        {
          platform: "Instagram",
          content:
            "🚀 Ready to transform your marketing game? Our AI agents are here to help! #MarketingAI #DigitalMarketing",
          hashtags: ["#MarketingAI", "#DigitalMarketing", "#SocialMedia", "#ContentCreation"],
          best_time: "2:00 PM",
        },
        {
          platform: "LinkedIn",
          content:
            "Discover how AI-powered marketing tools can streamline your workflow and boost ROI. What's your biggest marketing challenge?",
          hashtags: ["#MarketingAutomation", "#AI", "#BusinessGrowth"],
          best_time: "9:00 AM",
        },
      ],
    },
    "blog-writing": {
      title: "The Ultimate Guide to AI-Powered Marketing in 2024",
      meta_description:
        "Discover how AI is revolutionizing digital marketing. Learn strategies, tools, and best practices for 2024.",
      content: `# The Ultimate Guide to AI-Powered Marketing in 2024

## Introduction
Artificial Intelligence is transforming the marketing landscape...

## Key Benefits of AI in Marketing
1. Personalization at scale
2. Predictive analytics
3. Automated content creation

## Conclusion
AI-powered marketing is no longer optional—it's essential for staying competitive.`,
      word_count: 1250,
      readability_score: "Good",
    },
  }

  return mockOutputs[toolId] || { message: "Content generated successfully", data: input }
}

// @route   GET /api/ai-tools/usage-history
// @desc    Get user's AI tool usage history
// @access  Private
router.get("/usage-history", auth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 20
    const toolId = req.query.toolId

    const query = { userId: req.user.userId }
    if (toolId) {
      query.toolId = toolId
    }

    const usage = await AIToolUsage.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-input -output") // Exclude large fields for list view

    const total = await AIToolUsage.countDocuments(query)

    res.json({
      usage,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error("Get usage history error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
