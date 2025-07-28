const express = require("express")
const User = require("../models/User")
const AIToolUsage = require("../models/AIToolUsage")
const auth = require("../middleware/auth")
const rateLimit = require("express-rate-limit")
const axios = require('axios');
require('dotenv').config();

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
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

  if (toolId === 'social-media') {
    try {
      const prompt = `Generate a JSON object for a social media content plan for the following business:
Business: ${input.business}
Industry: ${input.industry}
Target Audience: ${input.targetAudience}
Platforms: ${input.platforms?.join(', ')}
Content Goals: ${input.contentGoals}
Brand Voice: ${input.brandVoice}
Post Frequency: ${input.postFrequency}

The JSON should have:
- posts: an array of 2-3 posts, each with platform, content, hashtags (array), bestTime, engagement
- analytics: { expectedReach, engagementRate, growthProjection, bestPerformingContent }
- strategy: { contentMix (array of {type, percentage, description}), postingSchedule (array of {day, times, contentType}), hashtagStrategy: { trending, niche, branded } }

Return ONLY valid JSON, no explanation.`;

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that generates social media content plans in JSON.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 800,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      // Parse the JSON from the response
      const text = response.data.choices[0].message.content;
      let output;
      try {
        output = JSON.parse(text);
      } catch (e) {
        // Try to extract JSON from text if not pure JSON
        const match = text.match(/\{[\s\S]*\}/);
        output = match ? JSON.parse(match[0]) : { error: 'Failed to parse AI response.' };
      }
      return output;
    } catch (error) {
      console.error('OpenAI API error:', error.response?.data || error.message);
      return { error: 'Failed to generate content using OpenAI.' };
    }
  }

  if (toolId === 'seo-audit') {
    try {
      const url = input.url;
      console.log('Starting comprehensive SEO audit for:', url);
      
      // Step 1: Comprehensive website analysis
      const websiteAnalysis = await performWebsiteAnalysis(url);
      console.log('Website analysis completed:', websiteAnalysis);
      
      if (websiteAnalysis.error) {
        return { error: websiteAnalysis.error, details: websiteAnalysis.details };
      }
      
      // Step 2: Generate comprehensive SEO report using AI
      const prompt = `You are an expert SEO analyst performing a comprehensive technical audit. Here is the detailed analysis of a website:

${JSON.stringify(websiteAnalysis, null, 2)}

Based on this comprehensive data, generate a detailed SEO audit report in JSON format. Your report must include ALL of these sections with realistic, actionable insights:

{
  "overallScore": number (0-100),
  "summary": {
    "score": number,
    "failed": number,
    "warnings": number,
    "passed": number,
    "criticalIssues": number,
    "improvementOpportunities": number
  },
  "technicalSEO": {
    "metaTitle": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "title": "actual title",
        "length": number,
        "recommendedLength": "50-60 characters",
        "keywordOptimization": "analysis",
        "duplicateTitles": boolean
      }
    },
    "metaDescription": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "description": "actual description",
        "length": number,
        "recommendedLength": "150-160 characters",
        "keywordOptimization": "analysis"
      }
    },
    "headingStructure": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "h1Count": number,
        "h2Count": number,
        "h3Count": number,
        "hierarchy": "analysis",
        "keywordUsage": "analysis"
      }
    },
    "images": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "totalImages": number,
        "imagesWithAlt": number,
        "imagesWithoutAlt": number,
        "optimizationScore": number,
        "compressionIssues": "analysis"
      }
    },
    "internalLinks": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "totalInternalLinks": number,
        "brokenInternalLinks": number,
        "anchorTextAnalysis": "analysis",
        "linkDepth": "analysis"
      }
    },
    "canonicalTags": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "hasCanonical": boolean,
        "canonicalUrl": "string",
        "duplicateContent": "analysis"
      }
    },
    "schemaMarkup": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "hasSchema": boolean,
        "schemaTypes": ["array"],
        "richSnippets": "analysis"
      }
    },
    "robotsTxt": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "hasRobotsTxt": boolean,
        "crawlability": "analysis"
      }
    },
    "sitemap": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "hasSitemap": boolean,
        "sitemapUrl": "string"
      }
    }
  },
  "performance": {
    "pageSpeed": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "estimatedLoadTime": number,
        "totalElements": number,
        "optimizationScore": number
      }
    },
    "coreWebVitals": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "lcp": "estimated",
        "fid": "estimated",
        "cls": "estimated"
      }
    },
    "compression": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "isCompressed": boolean,
        "compressionType": "string"
      }
    }
  },
  "security": {
    "https": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "isHttps": boolean,
        "sslGrade": "string",
        "mixedContent": "analysis"
      }
    },
    "securityHeaders": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "hasHsts": boolean,
        "hasCsp": boolean,
        "hasXFrameOptions": boolean,
        "securityScore": number
      }
    }
  },
  "mobileUsability": {
    "responsiveDesign": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "isResponsive": boolean,
        "viewportMeta": boolean,
        "mobileOptimized": boolean
      }
    },
    "touchTargets": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "smallTouchTargets": number,
        "touchTargetSize": "analysis"
      }
    },
    "mobileSpeed": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "mobileLoadTime": "estimated",
        "mobileOptimization": "analysis"
      }
    }
  },
  "contentQuality": {
    "readability": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "wordCount": number,
        "readabilityScore": "estimated",
        "paragraphCount": number,
        "contentStructure": "analysis"
      }
    },
    "keywordOptimization": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "primaryKeywords": ["array"],
        "keywordDensity": number,
        "keywordDistribution": "analysis"
      }
    },
    "contentUniqueness": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "duplicateContent": "analysis",
        "contentOriginality": "analysis"
      }
    }
  },
  "accessibility": {
    "altText": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "imagesWithAlt": number,
        "imagesWithoutAlt": number,
        "altTextQuality": "analysis"
      }
    },
    "ariaLabels": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "hasAriaLabels": boolean,
        "ariaLabelCount": number,
        "accessibilityScore": number
      }
    },
    "navigation": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "hasSkipLinks": boolean,
        "navigationStructure": "analysis"
      }
    }
  },
  "urlStructure": {
    "seoFriendly": {
      "status": "pass|warning|fail",
      "percentage": "X% of top sites passed",
      "description": "Detailed analysis",
      "details": {
        "urlLength": number,
        "hasHyphens": boolean,
        "hasUnderscores": boolean,
        "hasSpecialChars": boolean
      }
    }
  },
  "recommendations": [
    {
      "category": "Technical SEO|On-Page SEO|Performance|Security|Mobile|Content|Accessibility",
      "priority": "critical|high|medium|low",
      "title": "string",
      "description": "Detailed description",
      "action": "Specific action to take",
      "impact": "high|medium|low",
      "effort": "high|medium|low",
      "timeline": "immediate|1-2 weeks|1-3 months"
    }
  ],
  "priorityActions": [
    {
      "category": "string",
      "action": "string",
      "priority": "critical|high|medium|low",
      "effort": "high|medium|low",
      "impact": "high|medium|low"
    }
  ]
}

Analyze the website comprehensively and provide actionable insights. Base all statistics and scores on the actual data provided. Be specific and realistic. Return ONLY valid JSON, no explanation.`;

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are an expert SEO analyst that performs comprehensive technical audits. You understand all aspects of technical SEO, performance optimization, accessibility, and search engine requirements. Provide detailed, actionable insights based on real website analysis. Always return valid JSON.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 6000,
          temperature: 0.2
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const text = response.data.choices[0].message.content;
      let output;
      try {
        output = JSON.parse(text);
        console.log('Parsed comprehensive SEO audit result:', output);
      } catch (e) {
        console.error('Failed to parse OpenAI response:', e);
        console.log('Raw response:', text);
        output = { error: 'Failed to parse OpenAI response.' };
      }
      
      return output;
    } catch (error) {
      console.error('SEO Audit error:', error.response?.data || error.message);
      return { error: 'Failed to generate SEO audit. Please check the URL and try again.' };
    }
  }

  if (toolId === 'ad-copy') {
    try {
      const prompt = `Generate high-converting ad copy in JSON format for the following product/service:
Product/Service: ${input.product}
Target Audience: ${input.audience}
Platforms: ${input.platforms?.join(', ')}
Objective: ${input.objective}
Tone: ${input.tone}
Keywords: ${input.keywords}
Budget: ${input.budget}
Competitors: ${input.competitors}
Unique Selling Proposition: ${input.usp}

The JSON should have:
- variations: array of ad variations, each with {platform: string, format: string, headline: string, description: string, cta: string, character_count: {headline: number, description: number}, compliance_check: {passed: boolean, issues: string[]}}
- performance_predictions: {expected_ctr: string, expected_cpc: string, expected_conversion_rate: string, quality_score: number}
- optimization_tips: array of objects with {category: string, tip: string, impact: "high"|"medium"|"low"}
- a_b_test_suggestions: array of objects with {element: string, variation_a: string, variation_b: string, test_hypothesis: string}
- keyword_integration: {primary_keywords: string[], secondary_keywords: string[], keyword_density: number}

Return ONLY valid JSON, no explanation.`;

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are an expert copywriter that generates high-converting ad copy in JSON format.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 1200,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      // Parse the JSON from the response
      const text = response.data.choices[0].message.content;
      let output;
      try {
        output = JSON.parse(text);
      } catch (e) {
        // Try to extract JSON from text if not pure JSON
        const match = text.match(/\{[\s\S]*\}/);
        output = match ? JSON.parse(match[0]) : { error: 'Failed to parse AI response.' };
      }
      return output;
    } catch (error) {
      console.error('OpenAI API error:', error.response?.data || error.message);
      return { error: 'Failed to generate ad copy using OpenAI.' };
    }
  }

  if (toolId === 'competitor-analysis') {
    try {
      const prompt = `Generate a comprehensive competitor analysis in JSON format for the following business:

Your Company: ${input.yourCompany}
Competitors: ${input.competitors}
Industry: ${input.industry}
Target Market: ${input.location}
Analysis Type: ${input.analysisType}
Focus Areas: ${input.focusAreas}

Generate a detailed competitor analysis with this EXACT JSON structure:

{
  "competitors": [
    {
      "name": "Competitor Name",
      "website": "https://competitor.com",
      "overview": {
        "description": "Brief company description",
        "founded": "Year founded",
        "employees": "Employee count range",
        "revenue": "Revenue range"
      },
      "digital_presence": {
        "website_traffic": 50000,
        "social_followers": {
          "facebook": 15000,
          "twitter": 8000,
          "linkedin": 12000,
          "instagram": 10000
        },
        "seo_score": 75,
        "domain_authority": 65
      },
      "marketing_strategy": {
        "content_themes": ["theme1", "theme2"],
        "posting_frequency": "3-4 times per week",
        "ad_spend_estimate": "$10K-$50K/month",
        "top_keywords": [
          {
            "keyword": "example keyword",
            "position": 3,
            "volume": 5000
          }
        ]
      },
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"],
      "opportunities": ["opportunity1", "opportunity2"],
      "threats": ["threat1", "threat2"]
    }
  ],
  "market_analysis": {
    "market_size": "$50B",
    "growth_rate": "12% CAGR",
    "key_trends": ["trend1", "trend2", "trend3"],
    "market_leaders": ["leader1", "leader2"]
  },
  "competitive_gaps": [
    {
      "category": "Product Features",
      "opportunity": "Advanced analytics dashboard",
      "difficulty": "medium",
      "impact": "high"
    }
  ],
  "recommendations": [
    {
      "priority": "high",
      "category": "Product Development",
      "action": "Develop advanced analytics features",
      "rationale": "None of the top 3 competitors offer comprehensive analytics dashboards",
      "timeline": "3-6 months"
    }
  ],
  "benchmarking": {
    "your_position": "Challenger",
    "key_metrics_comparison": [
      {
        "metric": "Market Share",
        "your_score": 15,
        "competitor_avg": 25,
        "industry_avg": 20
      }
    ]
  }
}

Analyze the competitors thoroughly and provide realistic, actionable insights. Return ONLY valid JSON, no explanation.`;

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are an expert competitive intelligence analyst. You provide comprehensive competitor analysis with realistic data and actionable insights. Always return valid JSON.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 3000,
          temperature: 0.3
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const text = response.data.choices[0].message.content;
      let output;
      try {
        output = JSON.parse(text);
        console.log('Parsed competitor analysis result:', output);
      } catch (e) {
        console.error('Failed to parse OpenAI response:', e);
        console.log('Raw response:', text);
        output = { error: 'Failed to parse OpenAI response.' };
      }
      
      return output;
    } catch (error) {
      console.error('Competitor Analysis error:', error.response?.data || error.message);
      return { error: 'Failed to generate competitor analysis. Please try again.' };
    }
  }

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
          engagement: "High"
        },
        {
          platform: "LinkedIn",
          content:
            "Discover how AI-powered marketing tools can streamline your workflow and boost ROI. What's your biggest marketing challenge?",
          hashtags: ["#MarketingAutomation", "#AI", "#BusinessGrowth"],
          best_time: "9:00 AM",
          engagement: "Medium"
        },
      ],
      analytics: {
        expectedReach: "10,000",
        engagementRate: "5%",
        growthProjection: "12%",
        bestPerformingContent: "Educational"
      },
      strategy: {
        contentMix: [
          { type: "Educational", percentage: 40, description: "Posts that inform and educate your audience." },
          { type: "Promotional", percentage: 30, description: "Posts that promote your products or services." },
          { type: "Engagement", percentage: 20, description: "Posts that encourage audience interaction." },
          { type: "Inspirational", percentage: 10, description: "Posts that inspire your audience." }
        ],
        postingSchedule: [
          { day: "Monday", times: ["10:00 AM"], contentType: "Educational" },
          { day: "Wednesday", times: ["2:00 PM"], contentType: "Promotional" },
          { day: "Friday", times: ["5:00 PM"], contentType: "Engagement" }
        ],
        hashtagStrategy: {
          trending: ["#AI", "#Marketing"],
          niche: ["#SmallBusiness"],
          branded: ["#YourBrand"]
        }
      }
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

// Helper function to perform actual website analysis
async function performWebsiteAnalysis(url) {
  try {
    console.log('Starting comprehensive website analysis for:', url);
    const axios = require('axios');
    const cheerio = require('cheerio');
    
    // Fetch the website
    console.log('Fetching website...');
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEOAuditBot/1.0)'
      }
    });
    
    console.log('Website fetched successfully, status:', response.status);
    
    const html = response.data;
    const $ = cheerio.load(html);
    
    // ===== TECHNICAL SEO ANALYSIS =====
    
    // Meta information
    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const canonical = $('link[rel="canonical"]').attr('href') || '';
    const viewport = $('meta[name="viewport"]').attr('content') || '';
    const robots = $('meta[name="robots"]').attr('content') || '';
    
    // Check for duplicate meta tags
    const titleTags = $('title').length;
    const metaDescriptions = $('meta[name="description"]').length;
    const canonicalTags = $('link[rel="canonical"]').length;
    
    // ===== HEADING STRUCTURE ANALYSIS =====
    const headings = {
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: []
    };
    
    for (let i = 1; i <= 6; i++) {
      $(`h${i}`).each((index, el) => {
        headings[`h${i}`].push({
          text: $(el).text().trim(),
          length: $(el).text().trim().length
        });
      });
    }
    
    // ===== IMAGE ANALYSIS =====
    const images = [];
    $('img').each((i, el) => {
      const src = $(el).attr('src');
      const alt = $(el).attr('alt');
      const title = $(el).attr('title');
      const loading = $(el).attr('loading');
      const width = $(el).attr('width');
      const height = $(el).attr('height');
      
      images.push({ 
        src, 
        alt: alt || '', 
        title: title || '',
        loading: loading || 'eager',
        dimensions: { width, height }
      });
    });
    
    // ===== INTERNAL LINKING ANALYSIS =====
    const internalLinks = [];
    const externalLinks = [];
    const brokenLinks = [];
    
    $('a[href]').each((i, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      const title = $(el).attr('title');
      const rel = $(el).attr('rel');
      
      if (href) {
        const linkData = { href, text, title, rel };
        
        if (href.startsWith('/') || href.startsWith(url) || href.startsWith('./')) {
          internalLinks.push(linkData);
        } else if (href.startsWith('http')) {
          externalLinks.push(linkData);
        }
      }
    });
    
    // ===== SCHEMA MARKUP ANALYSIS =====
    const schemaScripts = [];
    $('script[type="application/ld+json"]').each((i, el) => {
      try {
        const schema = JSON.parse($(el).html());
        schemaScripts.push(schema);
      } catch (e) {
        // Invalid JSON, skip
      }
    });
    
    // ===== CONTENT ANALYSIS =====
    const bodyText = $('body').text();
    const wordCount = bodyText.split(/\s+/).filter(word => word.length > 0).length;
    const characterCount = bodyText.length;
    const paragraphCount = $('p').length;
    const listCount = $('ul, ol').length;
    
    // ===== PERFORMANCE INDICATORS =====
    const totalElements = $('*').length;
    const scriptCount = $('script').length;
    const styleCount = $('style').length;
    const linkCount = $('link').length;
    
    // ===== SECURITY & HTTPS ANALYSIS =====
    const isHttps = url.startsWith('https://');
    const hasSecurityHeaders = response.headers['x-frame-options'] || 
                              response.headers['x-content-type-options'] || 
                              response.headers['x-xss-protection'];
    
    // ===== MOBILE USABILITY =====
    const hasViewport = !!viewport;
    const hasTouchTargets = $('button, a, input, select, textarea').length > 0;
    const hasResponsiveImages = images.some(img => img.dimensions.width && img.dimensions.height);
    
    // ===== ACCESSIBILITY =====
    const hasAltText = images.filter(img => img.alt).length;
    const hasAriaLabels = $('[aria-label]').length;
    const hasAriaDescribedby = $('[aria-describedby]').length;
    const hasSkipLinks = $('a[href*="#main"], a[href*="#content"]').length;
    
    // ===== URL STRUCTURE ANALYSIS =====
    const urlPath = new URL(url).pathname;
    const urlLength = url.length;
    const hasHyphens = urlPath.includes('-');
    const hasUnderscores = urlPath.includes('_');
    const hasSpecialChars = /[^a-zA-Z0-9\-_\/]/.test(urlPath);
    
    // ===== KEYWORD ANALYSIS =====
    const titleKeywords = title.toLowerCase().split(/\s+/);
    const descriptionKeywords = metaDescription.toLowerCase().split(/\s+/);
    const headingKeywords = [...headings.h1, ...headings.h2, ...headings.h3]
      .map(h => h.text.toLowerCase().split(/\s+/))
      .flat();
    
    // ===== TECHNICAL CHECKS =====
    const hasRobotsTxt = await checkRobotsTxt(url);
    const hasSitemap = await checkSitemap(url);
    
    // Calculate scores and metrics
    const imageOptimizationScore = images.length > 0 ? (hasAltText / images.length) * 100 : 100;
    const headingStructureScore = headings.h1.length === 1 ? 100 : 
                                 headings.h1.length === 0 ? 0 : 
                                 headings.h1.length > 1 ? 50 : 75;
    const metaOptimizationScore = title.length > 10 && title.length < 60 && 
                                 metaDescription.length > 50 && metaDescription.length < 160 ? 100 : 50;
    
    const analysisResult = {
      url,
      timestamp: new Date().toISOString(),
      
      // Technical SEO
      technical: {
        title,
        metaDescription,
        canonical,
        viewport,
        robots,
        isHttps,
        hasSecurityHeaders: !!hasSecurityHeaders,
        hasRobotsTxt,
        hasSitemap,
        duplicateMetaTags: {
          titles: titleTags > 1,
          descriptions: metaDescriptions > 1,
          canonical: canonicalTags > 1
        }
      },
      
      // Content Analysis
      content: {
        wordCount,
        characterCount,
        paragraphCount,
        listCount,
        titleLength: title.length,
        descriptionLength: metaDescription.length,
        contentDensity: wordCount / totalElements
      },
      
      // Heading Structure
      headings,
      headingStructureScore,
      
      // Images
      images: {
        total: images.length,
        withAlt: hasAltText,
        withoutAlt: images.length - hasAltText,
        optimized: images.filter(img => img.alt && img.dimensions.width).length,
        list: images.slice(0, 10) // Limit to first 10 for analysis
      },
      imageOptimizationScore,
      
      // Links
      links: {
        internal: {
          total: internalLinks.length,
          list: internalLinks.slice(0, 10)
        },
        external: {
          total: externalLinks.length,
          list: externalLinks.slice(0, 10)
        }
      },
      
      // Schema Markup
      schema: {
        total: schemaScripts.length,
        types: schemaScripts.map(s => s['@type'] || 'Unknown'),
        list: schemaScripts
      },
      
      // Performance Indicators
      performance: {
        totalElements,
        scriptCount,
        styleCount,
        linkCount,
        estimatedLoadTime: Math.round(totalElements / 100) // Rough estimate
      },
      
      // Mobile Usability
      mobile: {
        hasViewport,
        hasTouchTargets,
        hasResponsiveImages,
        mobileFriendly: hasViewport && hasTouchTargets
      },
      
      // Accessibility
      accessibility: {
        hasAltText: hasAltText > 0,
        hasAriaLabels,
        hasAriaDescribedby,
        hasSkipLinks,
        accessibilityScore: Math.round((hasAltText + hasAriaLabels + hasSkipLinks) / 3 * 100)
      },
      
      // URL Structure
      urlAnalysis: {
        length: urlLength,
        hasHyphens,
        hasUnderscores,
        hasSpecialChars,
        seoFriendly: !hasUnderscores && !hasSpecialChars && urlLength < 100
      },
      
      // Keyword Analysis
      keywords: {
        titleKeywords,
        descriptionKeywords,
        headingKeywords,
        keywordDensity: Math.round((titleKeywords.length + descriptionKeywords.length) / 2)
      },
      
      // Scores
      scores: {
        technical: Math.round((headingStructureScore + metaOptimizationScore + (isHttps ? 100 : 0)) / 3),
        content: Math.round((wordCount > 300 ? 100 : wordCount / 3) + (imageOptimizationScore / 2)) / 2,
        mobile: Math.round((hasViewport ? 100 : 0) + (hasTouchTargets ? 100 : 0)) / 2,
        accessibility: Math.round((hasAltText > 0 ? 100 : 0) + (hasAriaLabels > 0 ? 100 : 0)) / 2
      }
    };
    
    console.log('Comprehensive website analysis completed');
    return analysisResult;
    
  } catch (error) {
    console.error('Website analysis error:', error.message);
    return {
      error: 'Failed to analyze website',
      details: error.message,
      url
    };
  }
}

// Helper function to check robots.txt
async function checkRobotsTxt(url) {
  try {
    const robotsUrl = new URL('/robots.txt', url).href;
    const response = await axios.get(robotsUrl, { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

// Helper function to check sitemap
async function checkSitemap(url) {
  try {
    const sitemapUrl = new URL('/sitemap.xml', url).href;
    const response = await axios.get(sitemapUrl, { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    return false;
  }
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
