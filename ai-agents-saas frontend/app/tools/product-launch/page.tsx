"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/header"
import Link from "next/link"
import { ArrowLeft, Play, Download, Copy, CheckCircle, Loader2, Rocket, Lock, Crown, Calendar, Target, TrendingUp, Mail, Share2 } from 'lucide-react'
import { useUserStore } from "@/lib/user-store"

interface LaunchPhase {
  phase: string
  timeline: string
  activities: string[]
  deliverables: string[]
  kpis: string[]
}

interface LaunchResult {
  timeline: LaunchPhase[]
  emailCampaigns: {
    prelaunch: string
    launch: string
    postlaunch: string
  }
  socialMediaPosts: {
    announcement: string
    countdown: string
    launch: string
    testimonial: string
  }
  pressRelease: string
  contentCalendar: {
    week: string
    content: Array<{
      date: string
      platform: string
      content: string
      type: string
    }>
  }[]
  analytics: {
    expectedReach: string
    projectedSignups: string
    estimatedRevenue: string
    conversionRate: string
  }
}

export default function ProductLaunchPage() {
  const { user } = useUserStore()
  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    targetAudience: "",
    launchDate: "",
    keyFeatures: "",
    pricing: "",
    competitors: "",
    launchGoals: "",
    budget: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<LaunchResult | null>(null)
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({})

  const hasAccess = user.plan === "Agency"

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenerate = async () => {
    if (!hasAccess) {
      alert("Please upgrade to Agency plan to use this tool.")
      return
    }

    if (!formData.productName || !formData.targetAudience) {
      alert("Please enter product name and target audience")
      return
    }

    setIsGenerating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 5000))

    // Mock comprehensive product launch results
    const mockResult: LaunchResult = {
      timeline: [
        {
          phase: "Pre-Launch (8 weeks before)",
          timeline: "Week -8 to -6",
          activities: [
            "Finalize product development and testing",
            "Create brand assets and marketing materials",
            "Build landing page and capture leads",
            "Develop content marketing strategy",
            "Identify and reach out to influencers",
            "Plan PR and media outreach",
          ],
          deliverables: [
            "Product demo videos",
            "Landing page with email capture",
            "Brand style guide",
            "Content calendar",
            "Influencer partnership agreements",
            "Press kit and media list",
          ],
          kpis: ["Email signups", "Social media followers", "Website traffic", "Demo requests"],
        },
        {
          phase: "Soft Launch (4 weeks before)",
          timeline: "Week -4 to -2",
          activities: [
            "Beta testing with select customers",
            "Gather feedback and testimonials",
            "Create case studies and success stories",
            "Build anticipation with teasers",
            "Prepare customer support materials",
            "Finalize pricing and packaging",
          ],
          deliverables: [
            "Beta user feedback report",
            "Customer testimonials",
            "Case studies",
            "Support documentation",
            "Pricing strategy",
            "Launch day checklist",
          ],
          kpis: ["Beta user satisfaction", "Feature adoption", "Support ticket volume", "Conversion rates"],
        },
        {
          phase: "Launch Week",
          timeline: "Week 0",
          activities: [
            "Execute coordinated launch campaign",
            "Send launch emails to subscribers",
            "Publish across all social channels",
            "Activate PR and media outreach",
            "Monitor and respond to feedback",
            "Track metrics and optimize",
          ],
          deliverables: [
            "Launch announcement",
            "Email campaigns",
            "Social media posts",
            "Press releases",
            "Customer onboarding flow",
            "Real-time analytics dashboard",
          ],
          kpis: ["Launch day signups", "Media coverage", "Social engagement", "Sales conversions"],
        },
        {
          phase: "Post-Launch (4 weeks after)",
          timeline: "Week +1 to +4",
          activities: [
            "Analyze launch performance",
            "Gather customer feedback",
            "Optimize onboarding process",
            "Plan follow-up campaigns",
            "Identify expansion opportunities",
            "Document lessons learned",
          ],
          deliverables: [
            "Launch performance report",
            "Customer feedback analysis",
            "Optimization recommendations",
            "Follow-up campaign plan",
            "Growth strategy",
            "Post-mortem documentation",
          ],
          kpis: ["Customer retention", "Feature usage", "Support satisfaction", "Revenue growth"],
        },
      ],
      emailCampaigns: {
        prelaunch: `Subject: Something big is coming to ${formData.productType}...

Hi [First Name],

I wanted to give you an exclusive heads-up about something we've been working on that I think you'll love.

After months of development and testing with ${formData.targetAudience} like yourself, we're finally ready to unveil ${formData.productName}.

Here's what makes it special:
${formData.keyFeatures
  ?.split(",")
  .map((feature) => `• ${feature.trim()}`)
  .join("\n")}

We're launching on ${formData.launchDate}, but I wanted to give our VIP subscribers first access.

Want to be among the first to try ${formData.productName}?

[Get Early Access Button]

You'll get:
✅ 30% off launch pricing
✅ Exclusive onboarding session
✅ Direct line to our product team
✅ Lifetime grandfathered pricing

Only 100 early access spots available.

Best,
[Your Name]
[Your Title]

P.S. We've already helped beta users achieve [specific result]. Can't wait to see what you'll accomplish!`,

        launch: `Subject: 🚀 ${formData.productName} is LIVE!

Hi [First Name],

The day is finally here! ${formData.productName} is officially live and ready to transform how you ${formData.productType}.

After 6 months of development and testing with 200+ beta users, we're confident this will be a game-changer for ${formData.targetAudience}.

🎉 LAUNCH WEEK SPECIAL 🎉
Get ${formData.productName} for just ${formData.pricing} (50% off regular price)
Valid until ${formData.launchDate} + 7 days

What you get:
${formData.keyFeatures
  ?.split(",")
  .map((feature) => `✅ ${feature.trim()}`)
  .join("\n")}

Real results from our beta users:
• "Increased efficiency by 40% in the first week" - Sarah M.
• "This solved our biggest challenge instantly" - Mike R.
• "ROI was positive within 30 days" - Jennifer L.

[Start Your Free Trial - No Credit Card Required]

Questions? Hit reply - I read every email personally.

Cheers to your success!
[Your Name]

P.S. This launch pricing expires in 7 days. After that, it goes to full price of [regular price].`,

        postlaunch: `Subject: How's your ${formData.productName} experience going?

Hi [First Name],

It's been a week since you started with ${formData.productName}, and I wanted to personally check in.

How are things going so far?

I know starting with any new tool can feel overwhelming, so I wanted to share the top 3 ways our most successful customers get results fast:

1. [Quick Win #1] - Takes 5 minutes, saves hours later
2. [Quick Win #2] - Most users see results within 24 hours  
3. [Quick Win #3] - The feature 90% of users wish they'd discovered sooner

Need help with anything? Our team is here for you:
• Live chat support (response time: under 2 minutes)
• Video tutorials and guides
• Weekly group onboarding calls
• Direct access to our product team

[Access Your Success Resources]

Also, I'd love to hear about your experience so far. What's working well? What could be better? Your feedback directly shapes our product roadmap.

[Share Your Feedback - 2 Minute Survey]

Thanks for being an early adopter!

Best,
[Your Name]
[Your Title]

P.S. Keep an eye out for our advanced features training next week - it's where the real magic happens!`,
      },
      socialMediaPosts: {
        announcement: `🚨 BIG ANNOUNCEMENT 🚨

After 6 months of development, we're thrilled to introduce ${formData.productName}!

Built specifically for ${formData.targetAudience}, this is the ${formData.productType} solution you've been waiting for.

✨ Key features:
${formData.keyFeatures
  ?.split(",")
  .map((feature) => `• ${feature.trim()}`)
  .join("\n")}

🎯 Perfect for: ${formData.targetAudience}
📅 Launch date: ${formData.launchDate}
💰 Early bird pricing: ${formData.pricing}

Want early access? Link in bio! 👆

#ProductLaunch #${formData.productType} #Innovation #${formData.targetAudience?.replace(/\s+/g, "")}`,

        countdown: `⏰ 3 DAYS TO GO! ⏰

The countdown to ${formData.productName} launch is ON!

Our beta users are already seeing incredible results:
📈 40% increase in efficiency
💰 ROI positive within 30 days  
⭐ 4.9/5 satisfaction rating

Ready to transform your ${formData.productType}?

Get on the early access list: [link in bio]

What are you most excited about? Drop a comment! 👇

#LaunchCountdown #${formData.productName} #ComingSoon`,

        launch: `🚀 IT'S LIVE! 🚀

${formData.productName} is officially here!

After months of anticipation, you can now experience the future of ${formData.productType}.

🎉 LAUNCH SPECIAL: 50% off for the first 48 hours!

👉 Get started: [link in bio]

Thank you to everyone who supported us on this journey. This is just the beginning! 

#LaunchDay #${formData.productName} #LiveNow #${formData.productType}`,

        testimonial: `💬 "This is exactly what we needed!"

"${formData.productName} solved our biggest challenge in the first week. The ROI was immediate and the team loves how easy it is to use." 

- Sarah M., ${formData.targetAudience}

Stories like this are why we built ${formData.productName}.

Ready to write your own success story?

👉 Start your free trial: [link in bio]

#CustomerSuccess #${formData.productName} #Testimonial`,
      },
      pressRelease: `FOR IMMEDIATE RELEASE

[Your Company] Launches ${formData.productName}: Revolutionary ${formData.productType} Solution for ${formData.targetAudience}

New platform addresses critical market gap with innovative approach to [key problem solved]

[City, Date] - [Your Company], a leading provider of [industry] solutions, today announced the launch of ${formData.productName}, a groundbreaking ${formData.productType} platform designed specifically for ${formData.targetAudience}.

The launch comes after extensive beta testing with over 200 users, who reported an average 40% improvement in efficiency and ROI within 30 days of implementation.

"We identified a significant gap in the market where ${formData.targetAudience} were struggling with [key problem]," said [Your Name], [Your Title] at [Your Company]. "Existing solutions were either too complex, too expensive, or simply didn't address the specific needs of this market. ${formData.productName} changes that."

Key features of ${formData.productName} include:
${formData.keyFeatures
  ?.split(",")
  .map((feature) => `• ${feature.trim()}`)
  .join("\n")}

The platform differentiates itself from competitors like ${formData.competitors} by focusing on [unique value proposition] and offering [key differentiator].

"The response from our beta users has been overwhelming," added [Your Name]. "We've seen companies reduce [specific metric] by up to 60% while increasing [another metric] by 45%. These aren't just incremental improvements - they're transformational."

${formData.productName} is available starting ${formData.launchDate} with pricing beginning at ${formData.pricing}. The company is offering a limited-time launch promotion of 50% off for the first 1,000 customers.

About [Your Company]
[Your Company] was founded in [year] with the mission to [company mission]. The company serves over [number] customers worldwide and has been recognized as [awards/recognition].

For more information about ${formData.productName}, visit [website] or contact [contact information].

Media Contact:
[Name]
[Title]
[Email]
[Phone]

###`,
      contentCalendar: [
        {
          week: "Launch Week",
          content: [
            {
              date: "Monday",
              platform: "LinkedIn",
              content: "Launch announcement with professional focus",
              type: "Announcement",
            },
            {
              date: "Tuesday",
              platform: "Twitter",
              content: "Behind-the-scenes launch day thread",
              type: "Behind-the-scenes",
            },
            {
              date: "Wednesday",
              platform: "Instagram",
              content: "Visual product showcase with features",
              type: "Product showcase",
            },
            {
              date: "Thursday",
              platform: "Facebook",
              content: "Customer testimonial and social proof",
              type: "Social proof",
            },
            {
              date: "Friday",
              platform: "LinkedIn",
              content: "Week 1 results and metrics sharing",
              type: "Results",
            },
          ],
        },
        {
          week: "Week 2",
          content: [
            {
              date: "Monday",
              platform: "Blog",
              content: "How-to guide featuring product capabilities",
              type: "Educational",
            },
            {
              date: "Tuesday",
              platform: "YouTube",
              content: "Product demo and tutorial video",
              type: "Tutorial",
            },
            {
              date: "Wednesday",
              platform: "Twitter",
              content: "User-generated content and community highlights",
              type: "Community",
            },
            {
              date: "Thursday",
              platform: "Instagram",
              content: "Team celebration and milestone sharing",
              type: "Celebration",
            },
            {
              date: "Friday",
              platform: "LinkedIn",
              content: "Industry insights and thought leadership",
              type: "Thought leadership",
            },
          ],
        },
      ],
      analytics: {
        expectedReach: "50,000-75,000",
        projectedSignups: "2,500-4,000",
        estimatedRevenue: "$125K-200K",
        conversionRate: "5-8%",
      },
    }

    setResult(mockResult)
    setIsGenerating(false)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied((prev) => ({ ...prev, [id]: true }))
    setTimeout(() => setCopied((prev) => ({ ...prev, [id]: false })), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/tools" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-400 to-purple-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Product Launch Agent</h1>
              {hasAccess ? (
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              ) : (
                <Badge className="bg-orange-100 text-orange-800">Agency Required</Badge>
              )}
            </div>
            <p className="text-gray-600">Complete launch campaign with emails, posts, and content calendar</p>
          </div>
        </div>

        {!hasAccess && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <Lock className="h-4 w-4" />
            <AlertDescription className="text-orange-800">
              This tool requires an Agency plan.
              <Link href="/upgrade" className="font-semibold underline ml-1">
                Upgrade now
              </Link>{" "}
              to access this feature.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Launch Setup</CardTitle>
                <CardDescription>Configure your product launch campaign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    placeholder="Enter your product name"
                    value={formData.productName}
                    onChange={(e) => handleInputChange("productName", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productType">Product Type</Label>
                  <select
                    id="productType"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    value={formData.productType}
                    onChange={(e) => handleInputChange("productType", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select product type</option>
                    <option value="SaaS Platform">SaaS Platform</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Physical Product">Physical Product</option>
                    <option value="Online Course">Online Course</option>
                    <option value="Consulting Service">Consulting Service</option>
                    <option value="E-book/Digital Product">E-book/Digital Product</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience *</Label>
                  <Input
                    id="targetAudience"
                    placeholder="Small business owners, marketers, developers"
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="launchDate">Launch Date</Label>
                  <Input
                    id="launchDate"
                    type="date"
                    value={formData.launchDate}
                    onChange={(e) => handleInputChange("launchDate", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keyFeatures">Key Features</Label>
                  <Textarea
                    id="keyFeatures"
                    placeholder="List main features (comma separated)"
                    value={formData.keyFeatures}
                    onChange={(e) => handleInputChange("keyFeatures", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricing">Pricing</Label>
                  <Input
                    id="pricing"
                    placeholder="$99/month, $299 one-time, Free with premium"
                    value={formData.pricing}
                    onChange={(e) => handleInputChange("pricing", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="competitors">Main Competitors</Label>
                  <Input
                    id="competitors"
                    placeholder="Competitor names (comma separated)"
                    value={formData.competitors}
                    onChange={(e) => handleInputChange("competitors", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="launchGoals">Launch Goals</Label>
                  <Textarea
                    id="launchGoals"
                    placeholder="What do you want to achieve with this launch?"
                    value={formData.launchGoals}
                    onChange={(e) => handleInputChange("launchGoals", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Marketing Budget</Label>
                  <select
                    id="budget"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    value={formData.budget}
                    onChange={(e) => handleInputChange("budget", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select budget range</option>
                    <option value="under-5k">Under $5,000</option>
                    <option value="5k-15k">$5,000 - $15,000</option>
                    <option value="15k-50k">$15,000 - $50,000</option>
                    <option value="50k-plus">$50,000+</option>
                  </select>
                </div>

                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleGenerate}
                    disabled={!hasAccess || isGenerating || !formData.productName || !formData.targetAudience}
                    className="w-full bg-gradient-to-r from-violet-400 to-purple-600 hover:opacity-90 text-white font-semibold py-3"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Launch Plan...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Generate Launch Campaign
                      </>
                    )}
                  </Button>

                  {!hasAccess && (
                    <div className="space-y-2">
                      <Link href="/upgrade">
                        <Button variant="outline" className="w-full bg-transparent">
                          <Crown className="w-4 h-4 mr-2" />
                          Upgrade to Agency Plan
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {!result ? (
              <Card>
                <CardContent className="text-center py-20">
                  <Rocket className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Launch</h3>
                  <p className="text-gray-600">
                    {hasAccess
                      ? "Set up your product details and generate a comprehensive launch campaign"
                      : "Upgrade to Agency plan to access the product launch tool"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Performance Projections */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Launch Projections
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{result.analytics.expectedReach}</div>
                        <div className="text-sm text-gray-600">Expected Reach</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{result.analytics.projectedSignups}</div>
                        <div className="text-sm text-gray-600">Projected Signups</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{result.analytics.estimatedRevenue}</div>
                        <div className="text-sm text-gray-600">Est. Revenue</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{result.analytics.conversionRate}</div>
                        <div className="text-sm text-gray-600">Conversion Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Launch Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-violet-500" />
                      Launch Timeline & Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {result.timeline.map((phase, index) => (
                      <div key={index} className="border rounded-lg p-6 bg-white">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">{phase.phase}</h3>
                          <Badge variant="outline">{phase.timeline}</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Activities:</h4>
                            <ul className="space-y-1 text-sm">
                              {phase.activities.map((activity, actIndex) => (
                                <li key={actIndex} className="flex items-start gap-2">
                                  <span className="w-2 h-2 bg-violet-500 rounded-full mt-2"></span>
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Deliverables:</h4>
                            <ul className="space-y-1 text-sm">
                              {phase.deliverables.map((deliverable, delIndex) => (
                                <li key={delIndex} className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                  {deliverable}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Key Metrics:</h4>
                            <ul className="space-y-1 text-sm">
                              {phase.kpis.map((kpi, kpiIndex) => (
                                <li key={kpiIndex} className="flex items-start gap-2">
                                  <Target className="w-4 h-4 text-blue-500 mt-0.5" />
                                  {kpi}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Email Campaigns */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-blue-500" />
                      Email Campaign Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(result.emailCampaigns).map(([type, content]) => (
                      <div key={type} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium capitalize">{type.replace(/([A-Z])/g, " $1").trim()} Email</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(content, `email-${type}`)}
                          >
                            {copied[`email-${type}`] ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{content}</pre>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Social Media Posts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Share2 className="w-5 h-5 text-pink-500" />
                      Social Media Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(result.socialMediaPosts).map(([type, content]) => (
                      <div key={type} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium capitalize">{type} Post</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(content, `social-${type}`)}
                          >
                            {copied[`social-${type}`] ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-line">{content}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Press Release */}
                <Card>
                  <CardHeader>
                    <CardTitle>Press Release Template</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-gray-600">Professional press release for media outreach</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(result.pressRelease, "press-release")}
                      >
                        {copied["press-release"] ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{result.pressRelease}</pre>
                    </div>
                  </CardContent>
                </Card>

                {/* Content Calendar */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-orange-500" />
                      Content Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.contentCalendar.map((week, weekIndex) => (
                      <div key={weekIndex} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3">{week.week}</h4>
                        <div className="space-y-2">
                          {week.content.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-xs">
                                  {item.date}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {item.platform}
                                </Badge>
                                <span className="text-sm">{item.content}</span>
                              </div>
                              <Badge className="text-xs bg-blue-100 text-blue-800">{item.type}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(JSON.stringify(result, null, 2), "all-launch")}
                    className="flex-1"
                  >
                    {copied["all-launch"] ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copied["all-launch"] ? "Copied!" : "Copy All Content"}
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export Launch Plan
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
