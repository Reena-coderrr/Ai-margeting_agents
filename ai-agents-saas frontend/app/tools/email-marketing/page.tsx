"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/header"
import Link from "next/link"
import {
  ArrowLeft,
  Play,
  Download,
  Copy,
  CheckCircle,
  Loader2,
  Mail,
  Lock,
  Crown,
  Send,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react"
import { useUserStore } from "@/lib/user-store"

interface EmailCampaign {
  type: string
  subject: string
  preheader: string
  content: string
  cta: string
  personalizations: string[]
}

interface EmailResult {
  campaigns: EmailCampaign[]
  sequence: {
    name: string
    emails: Array<{
      day: number
      subject: string
      purpose: string
      content: string
    }>
  }
  analytics: {
    expectedOpenRate: string
    expectedClickRate: string
    expectedConversionRate: string
    bestSendTime: string
  }
  optimization: {
    subjectLineVariations: string[]
    segmentationTips: string[]
    testingRecommendations: string[]
  }
}

export default function EmailMarketingPage() {
  const { user } = useUserStore()
  const [formData, setFormData] = useState({
    campaignType: "",
    subject: "",
    audience: "",
    goal: "",
    tone: "",
    industry: "",
    productService: "",
    urgency: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<EmailResult | null>(null)
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({})

  const hasAccess = user.plan !== "Free Trial"

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenerate = async () => {
    if (!hasAccess) {
      alert("Please upgrade to Pro or Agency plan to use this tool.")
      return
    }

    if (!formData.subject || !formData.audience) {
      alert("Please enter a subject line and target audience")
      return
    }

    setIsGenerating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 4500))

    // Mock comprehensive email marketing results
    const mockResult: EmailResult = {
      campaigns: [
        {
          type: "Welcome Email",
          subject: formData.subject || "Welcome to our community!",
          preheader: "Get started with your journey to success",
          content: generateEmailContent("welcome", formData.audience, formData.productService),
          cta: "Get Started Now",
          personalizations: ["First name", "Company name", "Industry"],
        },
        {
          type: "Nurture Email",
          subject: `${formData.audience ? `${formData.audience}, ` : ""}here's how to maximize your results`,
          preheader: "Proven strategies that work",
          content: generateEmailContent("nurture", formData.audience, formData.productService),
          cta: "Learn More",
          personalizations: ["First name", "Previous engagement", "Interests"],
        },
        {
          type: "Promotional Email",
          subject: `Limited time: Special offer for ${formData.audience || "you"}`,
          preheader: "Don't miss out on this exclusive opportunity",
          content: generateEmailContent("promotional", formData.audience, formData.productService),
          cta: "Claim Your Offer",
          personalizations: ["First name", "Purchase history", "Location"],
        },
      ],
      sequence: {
        name: "7-Day Onboarding Sequence",
        emails: [
          {
            day: 1,
            subject: "Welcome! Here's what to expect",
            purpose: "Welcome and set expectations",
            content: "Welcome email with onboarding roadmap",
          },
          {
            day: 3,
            subject: "Quick wins to get you started",
            purpose: "Provide immediate value",
            content: "Educational content with actionable tips",
          },
          {
            day: 5,
            subject: "Success story: How [Customer] achieved [Result]",
            purpose: "Social proof and inspiration",
            content: "Case study and testimonials",
          },
          {
            day: 7,
            subject: "Ready to take the next step?",
            purpose: "Soft promotion and engagement",
            content: "Gentle CTA with additional resources",
          },
        ],
      },
      analytics: {
        expectedOpenRate: `${Math.floor(Math.random() * 10) + 20}%`,
        expectedClickRate: `${Math.floor(Math.random() * 5) + 3}%`,
        expectedConversionRate: `${(Math.random() * 2 + 1).toFixed(1)}%`,
        bestSendTime: getBestSendTime(formData.audience),
      },
      optimization: {
        subjectLineVariations: generateSubjectVariations(formData.subject),
        segmentationTips: [
          "Segment by engagement level (active, inactive, new)",
          "Create industry-specific campaigns",
          "Personalize based on purchase history",
          "Use behavioral triggers for timing",
        ],
        testingRecommendations: [
          "A/B test subject lines with different emotional triggers",
          "Test send times across different days of the week",
          "Compare short vs. long email formats",
          "Test different CTA button colors and text",
        ],
      },
    }

    setResult(mockResult)
    setIsGenerating(false)
  }

  const generateEmailContent = (type: string, audience: string, product: string) => {
    const templates = {
      welcome: `Hi [First Name],

Welcome to our community! We're thrilled to have you join thousands of ${audience || "professionals"} who are already transforming their ${product || "business"}.

Here's what you can expect:
✅ Weekly insights and tips
✅ Exclusive resources and tools
✅ Access to our expert community
✅ Special offers and early access

To get started, here are 3 quick wins you can implement today:

1. [Quick Win #1] - This simple change can improve your results by 25%
2. [Quick Win #2] - A 5-minute task that saves hours later
3. [Quick Win #3] - The one thing most people overlook

Ready to dive in? Click the button below to access your welcome resources.

[CTA Button: Get Started Now]

Best regards,
[Your Name]
[Your Company]

P.S. Have questions? Simply reply to this email - I read every message personally!`,

      nurture: `Hi [First Name],

I hope you've had a chance to implement some of the strategies we shared earlier. 

Today, I want to share something that's been a game-changer for ${audience || "our clients"}: [Key Strategy/Insight].

Here's why this matters:
• 73% of ${audience || "professionals"} struggle with [Common Problem]
• This approach has helped our clients achieve [Specific Result]
• It takes just [Time Frame] to see initial results

Case Study: [Client Name] used this exact strategy to [Specific Achievement]. Here's how they did it:

[Step 1]: [Description]
[Step 2]: [Description]  
[Step 3]: [Description]

Want to learn the complete framework? I've created a detailed guide that walks you through each step.

[CTA Button: Get the Complete Guide]

Questions? Just hit reply - I'm here to help!

Best,
[Your Name]`,

      promotional: `Hi [First Name],

I have some exciting news to share with you!

For the next 48 hours, we're offering ${audience || "our community"} exclusive access to [Product/Service] at a special price.

Here's what makes this offer special:
🎯 [Benefit 1] - Save [Time/Money/Effort]
🎯 [Benefit 2] - Get [Specific Result]
🎯 [Benefit 3] - Access to [Exclusive Feature]

This is perfect for you if:
✓ You're ready to [Desired Outcome]
✓ You want to [Solve Specific Problem]
✓ You're serious about [Achieving Goal]

"[Testimonial quote from satisfied customer]" - [Customer Name], [Title]

The regular price is [Regular Price], but for the next 48 hours, you can get it for just [Special Price].

[CTA Button: Claim Your Special Offer]

This offer expires on [Date] at midnight, so don't wait!

Best regards,
[Your Name]

P.S. This pricing won't be available again this year, so if you've been waiting for the right time, this is it!`,
    }

    return templates[type as keyof typeof templates] || templates.welcome
  }

  const getBestSendTime = (audience: string) => {
    const times = {
      "business owners": "10:00 AM Tuesday",
      marketers: "2:00 PM Wednesday",
      entrepreneurs: "9:00 AM Thursday",
      professionals: "11:00 AM Tuesday",
    }

    const audienceLower = audience?.toLowerCase() || ""
    for (const [key, time] of Object.entries(times)) {
      if (audienceLower.includes(key)) return time
    }

    return "10:00 AM Tuesday"
  }

  const generateSubjectVariations = (originalSubject: string) => {
    if (!originalSubject) {
      return [
        "🚀 Ready to transform your business?",
        "The secret that changed everything",
        "Your exclusive invitation inside",
        "[First Name], this is for you",
      ]
    }

    return [
      `🔥 ${originalSubject}`,
      `[First Name], ${originalSubject.toLowerCase()}`,
      `URGENT: ${originalSubject}`,
      `Re: ${originalSubject}`,
      `${originalSubject} (Limited Time)`,
    ]
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
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-violet-600 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Email Marketing Agent</h1>
              {hasAccess ? (
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              ) : (
                <Badge className="bg-orange-100 text-orange-800">Pro Required</Badge>
              )}
            </div>
            <p className="text-gray-600">Create compelling email campaigns and automated sequences</p>
          </div>
        </div>

        {!hasAccess && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <Lock className="h-4 w-4" />
            <AlertDescription className="text-orange-800">
              This tool requires a Pro plan or higher.
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
                <CardTitle>Campaign Setup</CardTitle>
                <CardDescription>Configure your email marketing campaign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaignType">Campaign Type</Label>
                  <select
                    id="campaignType"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={formData.campaignType}
                    onChange={(e) => handleInputChange("campaignType", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select type</option>
                    <option value="welcome">Welcome Series</option>
                    <option value="nurture">Lead Nurturing</option>
                    <option value="promotional">Promotional</option>
                    <option value="newsletter">Newsletter</option>
                    <option value="re-engagement">Re-engagement</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Email Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="Boost your marketing ROI with AI"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience *</Label>
                  <Input
                    id="audience"
                    placeholder="Small business owners, marketers"
                    value={formData.audience}
                    onChange={(e) => handleInputChange("audience", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal">Campaign Goal</Label>
                  <select
                    id="goal"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={formData.goal}
                    onChange={(e) => handleInputChange("goal", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select goal</option>
                    <option value="lead-generation">Lead Generation</option>
                    <option value="sales">Drive Sales</option>
                    <option value="engagement">Increase Engagement</option>
                    <option value="retention">Customer Retention</option>
                    <option value="education">Education</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Email Tone</Label>
                  <select
                    id="tone"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={formData.tone}
                    onChange={(e) => handleInputChange("tone", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select tone</option>
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="urgent">Urgent</option>
                    <option value="educational">Educational</option>
                    <option value="conversational">Conversational</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productService">Product/Service</Label>
                  <Input
                    id="productService"
                    placeholder="AI marketing software, consulting services"
                    value={formData.productService}
                    onChange={(e) => handleInputChange("productService", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <select
                    id="urgency"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={formData.urgency}
                    onChange={(e) => handleInputChange("urgency", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select urgency</option>
                    <option value="low">Low - Informational</option>
                    <option value="medium">Medium - Time-sensitive</option>
                    <option value="high">High - Limited time offer</option>
                  </select>
                </div>

                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleGenerate}
                    disabled={!hasAccess || isGenerating || !formData.subject || !formData.audience}
                    className="w-full bg-gradient-to-r from-purple-400 to-violet-600 hover:opacity-90 text-white font-semibold py-3"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Campaign...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Generate Email Campaign
                      </>
                    )}
                  </Button>

                  {!hasAccess && (
                    <div className="space-y-2">
                      <Link href="/upgrade">
                        <Button variant="outline" className="w-full bg-transparent">
                          <Crown className="w-4 h-4 mr-2" />
                          Upgrade to Pro Plan
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
                  <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Create</h3>
                  <p className="text-gray-600">
                    {hasAccess
                      ? "Set up your campaign parameters and generate professional email content"
                      : "Upgrade to Pro plan to access the email marketing tool"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Performance Predictions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Expected Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{result.analytics.expectedOpenRate}</div>
                        <div className="text-sm text-gray-600">Open Rate</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{result.analytics.expectedClickRate}</div>
                        <div className="text-sm text-gray-600">Click Rate</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {result.analytics.expectedConversionRate}
                        </div>
                        <div className="text-sm text-gray-600">Conversion Rate</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-sm font-bold text-yellow-600">{result.analytics.bestSendTime}</div>
                        <div className="text-sm text-gray-600">Best Send Time</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Generated Campaigns */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-purple-500" />
                      Generated Email Campaigns ({result.campaigns.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {result.campaigns.map((campaign, index) => (
                      <div key={index} className="border rounded-lg p-6 bg-white">
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            {campaign.type}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(campaign.content, `campaign-${index}`)}
                          >
                            {copied[`campaign-${index}`] ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Subject Line:</h4>
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="font-medium">{campaign.subject}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Preheader:</h4>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-700">{campaign.preheader}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Email Content:</h4>
                            <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                                {campaign.content}
                              </pre>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Call to Action:</h4>
                              <div className="bg-green-50 p-3 rounded-lg">
                                <p className="text-green-800 font-medium">{campaign.cta}</p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Personalizations:</h4>
                              <div className="flex flex-wrap gap-1">
                                {campaign.personalizations.map((personalization, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {personalization}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Email Sequence */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      {result.sequence.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.sequence.emails.map((email, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                            {email.day}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{email.subject}</h4>
                            <p className="text-sm text-gray-600 mt-1">{email.purpose}</p>
                            <p className="text-xs text-gray-500 mt-2">{email.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Optimization Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-orange-500" />
                      Optimization Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Subject Line Variations for A/B Testing:</h4>
                      <div className="space-y-2">
                        {result.optimization.subjectLineVariations.map((variation, index) => (
                          <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                            {variation}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Segmentation Tips:</h4>
                      <ul className="space-y-1">
                        {result.optimization.segmentationTips.map((tip, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Testing Recommendations:</h4>
                      <ul className="space-y-1">
                        {result.optimization.testingRecommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(JSON.stringify(result, null, 2), "all-emails")}
                    className="flex-1"
                  >
                    {copied["all-emails"] ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copied["all-emails"] ? "Copied!" : "Copy All Campaigns"}
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export to Email Platform
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
