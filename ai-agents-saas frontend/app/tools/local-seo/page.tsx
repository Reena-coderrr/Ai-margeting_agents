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
import { ArrowLeft, Play, Download, Copy, CheckCircle, Loader2, MapPin, Lock, Crown, Star, TrendingUp, Search, Users } from 'lucide-react'
import { useUserStore } from "@/lib/user-store"

interface LocalSEOResult {
  businessProfile: {
    optimizationScore: number
    issues: Array<{
      issue: string
      priority: "High" | "Medium" | "Low"
      solution: string
    }>
    recommendations: string[]
  }
  keywordStrategy: {
    primaryKeywords: Array<{
      keyword: string
      searchVolume: string
      difficulty: string
      opportunity: string
    }>
    longTailKeywords: string[]
    locationModifiers: string[]
  }
  contentStrategy: {
    localPages: Array<{
      pageType: string
      title: string
      content: string
      keywords: string[]
    }>
    blogTopics: string[]
    faqSuggestions: string[]
  }
  citationAudit: {
    currentCitations: number
    missingCitations: Array<{
      platform: string
      importance: "High" | "Medium" | "Low"
      url: string
    }>
    inconsistencies: string[]
  }
  reviewStrategy: {
    currentRating: number
    reviewGoals: string[]
    responseTemplates: Array<{
      type: string
      template: string
    }>
    acquisitionStrategy: string[]
  }
  competitorAnalysis: {
    competitors: Array<{
      name: string
      ranking: number
      strengths: string[]
      weaknesses: string[]
      opportunities: string[]
    }>
    marketGaps: string[]
  }
  actionPlan: {
    phase: string
    timeline: string
    tasks: string[]
    expectedResults: string[]
  }[]
}

export default function LocalSEOPage() {
  const { user } = useUserStore()
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    location: "",
    serviceArea: "",
    primaryServices: "",
    targetKeywords: "",
    currentWebsite: "",
    competitors: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<LocalSEOResult | null>(null)
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

    if (!formData.businessName || !formData.location) {
      alert("Please enter business name and location")
      return
    }

    setIsGenerating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 5000))

    // Mock comprehensive local SEO results
    const mockResult: LocalSEOResult = {
      businessProfile: {
        optimizationScore: 72,
        issues: [
          {
            issue: "Missing business hours information",
            priority: "High",
            solution: "Add complete business hours including holidays and special hours",
          },
          {
            issue: "Insufficient business photos (only 3 photos)",
            priority: "High",
            solution: "Upload at least 10-15 high-quality photos including exterior, interior, products, and team",
          },
          {
            issue: "Business description needs optimization",
            priority: "Medium",
            solution: "Rewrite description to include primary keywords and unique value proposition",
          },
          {
            issue: "Missing attributes for accessibility and amenities",
            priority: "Medium",
            solution: "Add relevant attributes like wheelchair accessibility, Wi-Fi, parking, etc.",
          },
          {
            issue: "No posts in the last 30 days",
            priority: "Low",
            solution: "Create weekly Google My Business posts with updates, offers, and events",
          },
        ],
        recommendations: [
          "Verify business information across all platforms",
          "Encourage customers to add photos and reviews",
          "Respond to all reviews within 24 hours",
          "Use Google My Business messaging feature",
          "Post regular updates and offers",
          "Add products/services with detailed descriptions",
        ],
      },
      keywordStrategy: {
        primaryKeywords: [
          {
            keyword: `${formData.primaryServices} ${formData.location}`,
            searchVolume: "1,200/month",
            difficulty: "Medium",
            opportunity: "High",
          },
          {
            keyword: `best ${formData.businessType} ${formData.location}`,
            searchVolume: "800/month",
            difficulty: "High",
            opportunity: "Medium",
          },
          {
            keyword: `${formData.businessType} near me`,
            searchVolume: "2,100/month",
            difficulty: "High",
            opportunity: "High",
          },
          {
            keyword: `${formData.primaryServices} services ${formData.location}`,
            searchVolume: "650/month",
            difficulty: "Low",
            opportunity: "High",
          },
        ],
        longTailKeywords: [
          `affordable ${formData.primaryServices} in ${formData.location}`,
          `professional ${formData.businessType} ${formData.location}`,
          `${formData.location} ${formData.primaryServices} reviews`,
          `top rated ${formData.businessType} near ${formData.location}`,
          `${formData.primaryServices} ${formData.location} hours`,
          `emergency ${formData.primaryServices} ${formData.location}`,
        ],
        locationModifiers: [
          formData.location,
          `near ${formData.location}`,
          `${formData.location} area`,
          `${formData.location} downtown`,
          `${formData.location} suburbs`,
          formData.serviceArea,
        ],
      },
      contentStrategy: {
        localPages: [
          {
            pageType: "Service Area Page",
            title: `${formData.primaryServices} in ${formData.location} | ${formData.businessName}`,
            content: `Looking for professional ${formData.primaryServices} in ${formData.location}? ${formData.businessName} has been serving the ${formData.location} community for [X years] with exceptional ${formData.businessType} services.

Our ${formData.location} location offers:
• [Service 1] with local expertise
• [Service 2] tailored to ${formData.location} residents
• [Service 3] with same-day availability

Why choose ${formData.businessName} in ${formData.location}:
✓ Local ${formData.businessType} experts
✓ [X]+ years serving ${formData.location}
✓ [X]+ satisfied customers
✓ Licensed and insured
✓ Free estimates

Contact our ${formData.location} team today for your ${formData.primaryServices} needs.`,
            keywords: [
              `${formData.primaryServices} ${formData.location}`,
              `${formData.businessType} ${formData.location}`,
              `local ${formData.primaryServices}`,
            ],
          },
          {
            pageType: "About Us - Local Focus",
            title: `About ${formData.businessName} - Your Local ${formData.businessType} in ${formData.location}`,
            content: `${formData.businessName} is a locally-owned ${formData.businessType} proudly serving ${formData.location} and surrounding areas since [year].

Our Story:
Founded by [founder name], a ${formData.location} resident, we understand the unique needs of our community. We've built our reputation on quality ${formData.primaryServices} and exceptional customer service.

Community Involvement:
• Sponsor of [local event/team]
• Member of ${formData.location} Chamber of Commerce
• Volunteer with [local charity]
• Support local schools and organizations

Our ${formData.location} Team:
[Team member bios with local connections]

We're not just your ${formData.businessType} - we're your neighbors.`,
            keywords: [
              `local ${formData.businessType}`,
              `${formData.location} owned business`,
              `community ${formData.primaryServices}`,
            ],
          },
        ],
        blogTopics: [
          `Top 10 ${formData.primaryServices} Tips for ${formData.location} Residents`,
          `${formData.location} ${formData.businessType} Guide: What You Need to Know`,
          `Seasonal ${formData.primaryServices} Advice for ${formData.location}`,
          `${formData.businessName} Community Spotlight: ${formData.location} Events`,
          `Why Choose Local: Benefits of ${formData.location} ${formData.businessType}`,
          `${formData.location} Business Directory: Our Favorite Local Partners`,
        ],
        faqSuggestions: [
          `Do you serve all areas of ${formData.location}?`,
          `What makes your ${formData.primaryServices} different in ${formData.location}?`,
          `How quickly can you respond to ${formData.location} service calls?`,
          `Are you licensed to operate in ${formData.location}?`,
          `Do you offer emergency ${formData.primaryServices} in ${formData.location}?`,
          `What are your service hours in ${formData.location}?`,
        ],
      },
      citationAudit: {
        currentCitations: 45,
        missingCitations: [
          {
            platform: "Yelp Business",
            importance: "High",
            url: "https://biz.yelp.com",
          },
          {
            platform: "Apple Maps",
            importance: "High",
            url: "https://mapsconnect.apple.com",
          },
          {
            platform: "Bing Places",
            importance: "High",
            url: "https://www.bingplaces.com",
          },
          {
            platform: "Better Business Bureau",
            importance: "Medium",
            url: "https://www.bbb.org",
          },
          {
            platform: "Angie's List",
            importance: "Medium",
            url: "https://www.angieslist.com",
          },
          {
            platform: "Yellow Pages",
            importance: "Medium",
            url: "https://www.yellowpages.com",
          },
          {
            platform: "Foursquare",
            importance: "Low",
            url: "https://foursquare.com/business",
          },
        ],
        inconsistencies: [
          "Phone number format varies across platforms",
          "Business hours differ on 3 platforms",
          "Address abbreviation inconsistent",
          "Business category mismatch on 2 platforms",
        ],
      },
      reviewStrategy: {
        currentRating: 4.2,
        reviewGoals: [
          "Increase overall rating to 4.5+ stars",
          "Generate 10+ new reviews per month",
          "Improve response rate to 100%",
          "Address all negative reviews professionally",
          "Encourage photo reviews",
        ],
        responseTemplates: [
          {
            type: "Positive Review Response",
            template: `Thank you so much for the wonderful review, [Customer Name]! We're thrilled that you had a great experience with our ${formData.primaryServices} in ${formData.location}. Your feedback means the world to our team. We look forward to serving you again soon!

Best regards,
The ${formData.businessName} Team`,
          },
          {
            type: "Negative Review Response",
            template: `Hi [Customer Name], thank you for taking the time to share your feedback. We sincerely apologize that your experience with our ${formData.primaryServices} didn't meet your expectations. We take all feedback seriously and would love the opportunity to make this right. Please contact us directly at [phone] or [email] so we can discuss this further and find a solution.

Thank you,
[Manager Name]
${formData.businessName}`,
          },
          {
            type: "Neutral Review Response",
            template: `Thank you for your review, [Customer Name]. We appreciate you choosing ${formData.businessName} for your ${formData.primaryServices} needs in ${formData.location}. If there's anything we can do to improve your experience or if you have any questions, please don't hesitate to reach out.

Best regards,
The ${formData.businessName} Team`,
          },
        ],
        acquisitionStrategy: [
          "Send follow-up emails 3 days after service completion",
          "Include review request in invoices and receipts",
          "Train staff to verbally request reviews from satisfied customers",
          "Create QR codes linking to review platforms",
          "Offer small incentives for honest reviews (where allowed)",
          "Use text message campaigns for review requests",
        ],
      },
      competitorAnalysis: {
        competitors: [
          {
            name: `${formData.competitors?.split(",")[0] || "Competitor A"}`,
            ranking: 1,
            strengths: [
              "Higher review count (200+ reviews)",
              "Better Google My Business optimization",
              "Active social media presence",
              "Professional website with local SEO",
            ],
            weaknesses: [
              "Higher pricing than market average",
              "Limited service area coverage",
              "Slower response time to reviews",
              "Outdated business photos",
            ],
            opportunities: [
              "Target their underserved service areas",
              "Compete on pricing and value",
              "Improve review response time",
              "Create better visual content",
            ],
          },
          {
            name: `${formData.competitors?.split(",")[1] || "Competitor B"}`,
            ranking: 2,
            strengths: [
              "Long-established local presence",
              "Strong word-of-mouth reputation",
              "Comprehensive service offerings",
              "Good local partnerships",
            ],
            weaknesses: [
              "Poor online presence",
              "Limited digital marketing",
              "Inconsistent branding",
              "No online booking system",
            ],
            opportunities: [
              "Leverage superior digital presence",
              "Target tech-savvy customers",
              "Offer online convenience features",
              "Create modern brand experience",
            ],
          },
        ],
        marketGaps: [
          "Emergency/24-hour service availability",
          "Online booking and scheduling",
          "Transparent pricing information",
          "Specialized services for [specific niche]",
          "Eco-friendly/sustainable options",
          "Mobile service offerings",
        ],
      },
      actionPlan: [
        {
          phase: "Foundation (Month 1)",
          timeline: "Weeks 1-4",
          tasks: [
            "Complete Google My Business optimization",
            "Audit and fix NAP inconsistencies",
            "Create/claim missing citations",
            "Optimize website for local keywords",
            "Set up review monitoring system",
          ],
          expectedResults: [
            "Improved local search visibility",
            "Consistent business information",
            "Foundation for review growth",
            "Better website local relevance",
          ],
        },
        {
          phase: "Content & Reviews (Month 2)",
          timeline: "Weeks 5-8",
          tasks: [
            "Create local landing pages",
            "Launch review acquisition campaign",
            "Start weekly GMB posting",
            "Develop local content calendar",
            "Implement review response system",
          ],
          expectedResults: [
            "Increased local keyword rankings",
            "Growing review count and rating",
            "Regular customer engagement",
            "Improved local authority",
          ],
        },
        {
          phase: "Expansion & Optimization (Month 3+)",
          timeline: "Ongoing",
          tasks: [
            "Expand citation portfolio",
            "Launch local link building campaign",
            "Create location-specific content",
            "Monitor and adjust strategies",
            "Track competitor movements",
          ],
          expectedResults: [
            "Top 3 local search rankings",
            "Sustained review growth",
            "Increased local website traffic",
            "Higher conversion rates",
          ],
        },
      ],
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
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Local SEO Optimizer</h1>
              {hasAccess ? (
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              ) : (
                <Badge className="bg-orange-100 text-orange-800">Pro Required</Badge>
              )}
            </div>
            <p className="text-gray-600">Complete local SEO audit and optimization strategy</p>
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
                <CardTitle>Business Setup</CardTitle>
                <CardDescription>Configure your local SEO analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    placeholder="Enter your business name"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <select
                    id="businessType"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.businessType}
                    onChange={(e) => handleInputChange("businessType", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select business type</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="retail store">Retail Store</option>
                    <option value="service provider">Service Provider</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="automotive">Automotive</option>
                    <option value="real estate">Real Estate</option>
                    <option value="legal services">Legal Services</option>
                    <option value="home services">Home Services</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Primary Location *</Label>
                  <Input
                    id="location"
                    placeholder="City, State (e.g., Austin, TX)"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceArea">Service Area</Label>
                  <Input
                    id="serviceArea"
                    placeholder="Areas you serve (e.g., Austin Metro, Travis County)"
                    value={formData.serviceArea}
                    onChange={(e) => handleInputChange("serviceArea", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryServices">Primary Services</Label>
                  <Textarea
                    id="primaryServices"
                    placeholder="List your main services (comma separated)"
                    value={formData.primaryServices}
                    onChange={(e) => handleInputChange("primaryServices", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetKeywords">Target Keywords</Label>
                  <Textarea
                    id="targetKeywords"
                    placeholder="Keywords you want to rank for (comma separated)"
                    value={formData.targetKeywords}
                    onChange={(e) => handleInputChange("targetKeywords", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentWebsite">Website URL</Label>
                  <Input
                    id="currentWebsite"
                    placeholder="https://yourwebsite.com"
                    value={formData.currentWebsite}
                    onChange={(e) => handleInputChange("currentWebsite", e.target.value)}
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

                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleGenerate}
                    disabled={!hasAccess || isGenerating || !formData.businessName || !formData.location}
                    className="w-full bg-gradient-to-r from-green-400 to-emerald-600 hover:opacity-90 text-white font-semibold py-3"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing Local SEO...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Generate Local SEO Audit
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
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Optimize</h3>
                  <p className="text-gray-600">
                    {hasAccess
                      ? "Enter your business details and generate a comprehensive local SEO strategy"
                      : "Upgrade to Pro plan to access the local SEO optimizer"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Business Profile Score */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Local SEO Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl font-bold text-green-600">{result.businessProfile.optimizationScore}/100</div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-green-500 h-3 rounded-full"
                            style={{ width: `${result.businessProfile.optimizationScore}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Good - Room for improvement</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Critical Issues:</h4>
                        <div className="space-y-2">
                          {result.businessProfile.issues
                            .filter((issue) => issue.priority === "High")
                            .map((issue, index) => (
                              <div key={index} className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className="bg-red-100 text-red-800 text-xs">High Priority</Badge>
                                </div>
                                <p className="text-sm font-medium text-red-900">{issue.issue}</p>
                                <p className="text-xs text-red-700 mt-1">{issue.solution}</p>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Quick Wins:</h4>
                        <div className="space-y-2">
                          {result.businessProfile.issues
                            .filter((issue) => issue.priority === "Medium")
                            .slice(0, 2)
                            .map((issue, index) => (
                              <div key={index} className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">Medium Priority</Badge>
                                </div>
                                <p className="text-sm font-medium text-yellow-900">{issue.issue}</p>
                                <p className="text-xs text-yellow-700 mt-1">{issue.solution}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Keyword Strategy */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="w-5 h-5 text-blue-500" />
                      Local Keyword Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Primary Target Keywords:</h4>
                      <div className="space-y-3">
                        {result.keywordStrategy.primaryKeywords.map((keyword, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium">{keyword.keyword}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-sm text-gray-600">Volume: {keyword.searchVolume}</span>
                                <Badge
                                  className={`text-xs ${
                                    keyword.difficulty === "Low"
                                      ? "bg-green-100 text-green-800"
                                      : keyword.difficulty === "Medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {keyword.difficulty} Difficulty
                                </Badge>
                                <Badge
                                  className={`text-xs ${
                                    keyword.opportunity === "High"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {keyword.opportunity} Opportunity
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Long-tail Keywords:</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.keywordStrategy.longTailKeywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Content Strategy */}
                <Card>
                  <CardHeader>
                    <CardTitle>Local Content Strategy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {result.contentStrategy.localPages.map((page, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{page.pageType}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(page.content, `page-${index}`)}
                          >
                            {copied[`page-${index}`] ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Optimized Title:</p>
                            <p className="font-medium text-blue-600">{page.title}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Content Preview:</p>
                            <div className="bg-gray-50 p-3 rounded text-sm max-h-32 overflow-y-auto">
                              {page.content.substring(0, 300)}...
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Target Keywords:</p>
                            <div className="flex flex-wrap gap-1">
                              {page.keywords.map((keyword, kIndex) => (
                                <Badge key={kIndex} variant="outline" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Blog Content Ideas:</h4>
                      <ul className="space-y-1">
                        {result.contentStrategy.blogTopics.map((topic, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Citation Audit */}
                <Card>
                  <CardHeader>
                    <CardTitle>Citation Audit & Directory Listings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{result.citationAudit.currentCitations}</div>
                        <div className="text-sm text-gray-600">Current Citations</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{result.citationAudit.missingCitations.length}</div>
                        <div className="text-sm text-gray-600">Missing Citations</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{result.citationAudit.inconsistencies.length}</div>
                        <div className="text-sm text-gray-600">Inconsistencies</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Priority Citations to Create:</h4>
                      <div className="space-y-2">
                        {result.citationAudit.missingCitations
                          .filter((citation) => citation.importance === "High")
                          .map((citation, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium">{citation.platform}</p>
                                <Badge className="bg-red-100 text-red-800 text-xs">High Priority</Badge>
                              </div>
                              <Link
                                href={citation.url}
                                target="_blank"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Create Listing →
                              </Link>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Data Inconsistencies to Fix:</h4>
                      <ul className="space-y-1">
                        {result.citationAudit.inconsistencies.map((inconsistency, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-yellow-500" />
                            {inconsistency}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Review Strategy */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Review Management Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-yellow-600">{result.reviewStrategy.currentRating}</div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Current Rating</p>
                        <p className="text-sm font-medium">Goal: 4.5+ stars</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Review Response Templates:</h4>
                      <div className="space-y-3">
                        {result.reviewStrategy.responseTemplates.map((template, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">{template.type}</h5>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(template.template, `template-${index}`)}
                              >
                                {copied[`template-${index}`] ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                            <div className="bg-gray-50 p-3 rounded text-sm max-h-32 overflow-y-auto">
                              {template.template}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Review Acquisition Strategy:</h4>
                      <ul className="space-y-1">
                        {result.reviewStrategy.acquisitionStrategy.map((strategy, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {strategy}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Competitor Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-500" />
                      Competitor Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.competitorAnalysis.competitors.map((competitor, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{competitor.name}</h4>
                          <Badge className="bg-purple-100 text-purple-800">Rank #{competitor.ranking}</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h5 className="text-sm font-medium text-green-600 mb-1">Strengths:</h5>
                            <ul className="text-xs space-y-1">
                              {competitor.strengths.map((strength, sIndex) => (
                                <li key={sIndex} className="text-gray-600">• {strength}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-red-600 mb-1">Weaknesses:</h5>
                            <ul className="text-xs space-y-1">
                              {competitor.weaknesses.map((weakness, wIndex) => (
                                <li key={wIndex} className="text-gray-600">• {weakness}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-blue-600 mb-1">Opportunities:</h5>
                            <ul className="text-xs space-y-1">
                              {competitor.opportunities.map((opportunity, oIndex) => (
                                <li key={oIndex} className="text-gray-600">• {opportunity}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Market Gaps to Exploit:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {result.competitorAnalysis.marketGaps.map((gap, index) => (
                          <div key={index} className="p-2 bg-blue-50 rounded text-sm text-blue-800">
                            {gap}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Plan */}
                <Card>
                  <CardHeader>
                    <CardTitle>90-Day Action Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {result.actionPlan.map((phase, index) => (
                      <div key={index} className="border rounded-lg p-6 bg-white">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">{phase.phase}</h3>
                          <Badge variant="outline">{phase.timeline}</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Tasks:</h4>
                            <ul className="space-y-1">
                              {phase.tasks.map((task, taskIndex) => (
                                <li key={taskIndex} className="text-sm text-gray-600 flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                                  {task}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Expected Results:</h4>
                            <ul className="space-y-1">
                              {phase.expectedResults.map((result, resultIndex) => (
                                <li key={resultIndex} className="text-sm text-gray-600 flex items-start gap-2">
                                  <TrendingUp className="w-4 h-4 text-green-500 mt-0.5" />
                                  {result}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(JSON.stringify(result, null, 2), "all-local-seo")}
                    className="flex-1"
                  >
                    {copied["all-local-seo"] ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copied["all-local-seo"] ? "Copied!" : "Copy Full Report"}
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export SEO Plan
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
