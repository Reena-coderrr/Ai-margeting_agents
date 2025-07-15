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
import {
  ArrowLeft,
  Play,
  Download,
  Copy,
  CheckCircle,
  Loader2,
  Eye,
  Lock,
  Crown,
  TrendingUp,
  Users,
  Globe,
  Star,
  AlertTriangle,
} from "lucide-react"
import { useUserStore } from "@/lib/user-store"
import { Target, BarChart3 } from "lucide-react" // Import missing variables

interface CompetitorData {
  name: string
  website: string
  overview: {
    description: string
    founded: string
    employees: string
    revenue: string
  }
  digital_presence: {
    website_traffic: number
    social_followers: {
      facebook: number
      twitter: number
      linkedin: number
      instagram: number
    }
    seo_score: number
    domain_authority: number
  }
  marketing_strategy: {
    content_themes: string[]
    posting_frequency: string
    ad_spend_estimate: string
    top_keywords: Array<{
      keyword: string
      position: number
      volume: number
    }>
  }
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

interface CompetitorResult {
  competitors: CompetitorData[]
  market_analysis: {
    market_size: string
    growth_rate: string
    key_trends: string[]
    market_leaders: string[]
  }
  competitive_gaps: Array<{
    category: string
    opportunity: string
    difficulty: "low" | "medium" | "high"
    impact: "low" | "medium" | "high"
  }>
  recommendations: Array<{
    priority: "high" | "medium" | "low"
    category: string
    action: string
    rationale: string
    timeline: string
  }>
  benchmarking: {
    your_position: string
    key_metrics_comparison: Array<{
      metric: string
      your_score: number
      competitor_avg: number
      industry_avg: number
    }>
  }
}

export default function CompetitorAnalysisPage() {
  const { user } = useUserStore()
  const [formData, setFormData] = useState({
    yourCompany: "",
    competitors: "",
    industry: "",
    location: "",
    analysisType: "",
    focusAreas: "",
    yourWebsite: "",
    budget: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<CompetitorResult | null>(null)
  const [copied, setCopied] = useState(false)

  const hasAccess = user.plan !== "Free Trial"

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenerate = async () => {
    if (!hasAccess) {
      alert("Please upgrade to Pro or Agency plan to use this tool.")
      return
    }

    if (!formData.yourCompany || !formData.competitors) {
      alert("Please enter your company name and competitor list")
      return
    }

    setIsGenerating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 6000))

    // Mock comprehensive competitor analysis results
    const competitorNames = formData.competitors
      .split(",")
      .map((c) => c.trim())
      .slice(0, 3)

    const mockResult: CompetitorResult = {
      competitors: competitorNames.map((name, index) => ({
        name: name || `Competitor ${index + 1}`,
        website: `https://${name.toLowerCase().replace(/\s+/g, "")}.com`,
        overview: {
          description: `${name} is a leading company in the ${formData.industry || "technology"} sector, known for innovative solutions and strong market presence.`,
          founded: `${2010 + Math.floor(Math.random() * 10)}`,
          employees: `${Math.floor(Math.random() * 500) + 100}-${Math.floor(Math.random() * 500) + 600}`,
          revenue: `$${Math.floor(Math.random() * 50) + 10}M - $${Math.floor(Math.random() * 100) + 60}M`,
        },
        digital_presence: {
          website_traffic: Math.floor(Math.random() * 500000) + 100000,
          social_followers: {
            facebook: Math.floor(Math.random() * 50000) + 10000,
            twitter: Math.floor(Math.random() * 30000) + 5000,
            linkedin: Math.floor(Math.random() * 20000) + 3000,
            instagram: Math.floor(Math.random() * 40000) + 8000,
          },
          seo_score: Math.floor(Math.random() * 30) + 60,
          domain_authority: Math.floor(Math.random() * 20) + 50,
        },
        marketing_strategy: {
          content_themes: ["Product Innovation", "Industry Insights", "Customer Success", "Thought Leadership"],
          posting_frequency: "3-4 posts per week",
          ad_spend_estimate: `$${Math.floor(Math.random() * 50) + 20}K/month`,
          top_keywords: [
            {
              keyword: `${formData.industry || "technology"} solutions`,
              position: Math.floor(Math.random() * 10) + 1,
              volume: Math.floor(Math.random() * 5000) + 2000,
            },
            {
              keyword: `best ${formData.industry || "software"}`,
              position: Math.floor(Math.random() * 15) + 5,
              volume: Math.floor(Math.random() * 3000) + 1500,
            },
            {
              keyword: `${name.toLowerCase()} review`,
              position: Math.floor(Math.random() * 5) + 1,
              volume: Math.floor(Math.random() * 2000) + 800,
            },
          ],
        },
        strengths: [
          "Strong brand recognition",
          "Comprehensive product suite",
          "Excellent customer support",
          "Active social media presence",
        ],
        weaknesses: [
          "Higher pricing compared to alternatives",
          "Complex onboarding process",
          "Limited customization options",
          "Slow feature development cycle",
        ],
        opportunities: [
          "Expansion into emerging markets",
          "Integration with popular platforms",
          "Mobile app development",
          "AI/ML feature enhancement",
        ],
        threats: [
          "New market entrants",
          "Economic downturn impact",
          "Changing customer preferences",
          "Regulatory changes",
        ],
      })),
      market_analysis: {
        market_size: `$${Math.floor(Math.random() * 50) + 20}B`,
        growth_rate: `${Math.floor(Math.random() * 10) + 8}% CAGR`,
        key_trends: [
          "Increased adoption of AI and automation",
          "Shift towards cloud-based solutions",
          "Growing demand for mobile-first experiences",
          "Focus on data privacy and security",
          "Rise of subscription-based models",
        ],
        market_leaders: competitorNames.slice(0, 2).concat(["Industry Leader Corp", "Market Dominator Inc"]),
      },
      competitive_gaps: [
        {
          category: "Product Features",
          opportunity: "Advanced analytics dashboard missing from top competitors",
          difficulty: "medium",
          impact: "high",
        },
        {
          category: "Pricing Strategy",
          opportunity: "Flexible pricing tiers for small businesses",
          difficulty: "low",
          impact: "medium",
        },
        {
          category: "Customer Experience",
          opportunity: "24/7 live chat support not widely offered",
          difficulty: "medium",
          impact: "high",
        },
        {
          category: "Content Marketing",
          opportunity: "Video content strategy underutilized",
          difficulty: "low",
          impact: "medium",
        },
      ],
      recommendations: [
        {
          priority: "high",
          category: "Product Development",
          action: "Develop advanced analytics features",
          rationale: "None of the top 3 competitors offer comprehensive analytics dashboards",
          timeline: "3-6 months",
        },
        {
          priority: "high",
          category: "Marketing",
          action: "Increase content marketing frequency",
          rationale: "Competitors are posting 3-4x per week while you could dominate with daily content",
          timeline: "1-2 months",
        },
        {
          priority: "medium",
          category: "SEO",
          action: "Target competitor keyword gaps",
          rationale: "Identified 15+ high-volume keywords with low competition",
          timeline: "2-4 months",
        },
        {
          priority: "medium",
          category: "Social Media",
          action: "Expand LinkedIn presence",
          rationale: "Competitors have 2-3x more LinkedIn followers in your target market",
          timeline: "3-6 months",
        },
        {
          priority: "low",
          category: "Partnerships",
          action: "Explore integration partnerships",
          rationale: "Competitors lack integrations with popular tools in your space",
          timeline: "6-12 months",
        },
      ],
      benchmarking: {
        your_position: "Strong challenger with significant growth potential",
        key_metrics_comparison: [
          {
            metric: "Website Traffic",
            your_score: 85000,
            competitor_avg: 245000,
            industry_avg: 180000,
          },
          {
            metric: "Social Media Followers",
            your_score: 12000,
            competitor_avg: 35000,
            industry_avg: 25000,
          },
          {
            metric: "SEO Score",
            your_score: 72,
            competitor_avg: 78,
            industry_avg: 65,
          },
          {
            metric: "Content Publishing",
            your_score: 2,
            competitor_avg: 4,
            industry_avg: 3,
          },
        ],
      },
    }

    setResult(mockResult)
    setIsGenerating(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "low":
        return "bg-gray-100 text-gray-800"
      case "medium":
        return "bg-blue-100 text-blue-800"
      case "high":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getComparisonColor = (yourScore: number, avgScore: number) => {
    if (yourScore > avgScore) return "text-green-600"
    if (yourScore < avgScore) return "text-red-600"
    return "text-gray-600"
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
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Competitor Analysis Agent</h1>
              {hasAccess ? (
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              ) : (
                <Badge className="bg-orange-100 text-orange-800">Pro Required</Badge>
              )}
            </div>
            <p className="text-gray-600">Deep competitive intelligence with SWOT analysis and market positioning</p>
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
                <CardTitle>Analysis Setup</CardTitle>
                <CardDescription>Configure your competitive analysis parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="yourCompany">Your Company Name *</Label>
                  <Input
                    id="yourCompany"
                    placeholder="Your Company Inc."
                    value={formData.yourCompany}
                    onChange={(e) => handleInputChange("yourCompany", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="competitors">Competitor List *</Label>
                  <Textarea
                    id="competitors"
                    placeholder="Competitor A, Competitor B, Competitor C"
                    value={formData.competitors}
                    onChange={(e) => handleInputChange("competitors", e.target.value)}
                    disabled={!hasAccess}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <select
                    id="industry"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={formData.industry}
                    onChange={(e) => handleInputChange("industry", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select industry</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="retail">Retail</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="services">Professional Services</option>
                    <option value="education">Education</option>
                    <option value="real-estate">Real Estate</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Target Market</Label>
                  <select
                    id="location"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select market</option>
                    <option value="global">Global</option>
                    <option value="north-america">North America</option>
                    <option value="europe">Europe</option>
                    <option value="asia-pacific">Asia Pacific</option>
                    <option value="local">Local/Regional</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="analysisType">Analysis Type</Label>
                  <select
                    id="analysisType"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={formData.analysisType}
                    onChange={(e) => handleInputChange("analysisType", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select type</option>
                    <option value="comprehensive">Comprehensive Analysis</option>
                    <option value="digital-marketing">Digital Marketing Focus</option>
                    <option value="product-features">Product Features</option>
                    <option value="pricing-strategy">Pricing Strategy</option>
                    <option value="content-marketing">Content Marketing</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="focusAreas">Focus Areas</Label>
                  <Textarea
                    id="focusAreas"
                    placeholder="SEO, Social Media, Content Marketing, Pricing, Product Features"
                    value={formData.focusAreas}
                    onChange={(e) => handleInputChange("focusAreas", e.target.value)}
                    disabled={!hasAccess}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yourWebsite">Your Website (Optional)</Label>
                  <Input
                    id="yourWebsite"
                    placeholder="https://yourcompany.com"
                    value={formData.yourWebsite}
                    onChange={(e) => handleInputChange("yourWebsite", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleGenerate}
                    disabled={!hasAccess || isGenerating || !formData.yourCompany || !formData.competitors}
                    className="w-full bg-gradient-to-r from-indigo-400 to-purple-600 hover:opacity-90 text-white font-semibold py-3"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing Competitors...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Analysis
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
                  <Eye className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Analyze</h3>
                  <p className="text-gray-600">
                    {hasAccess
                      ? "Enter your company details and competitor list to start comprehensive analysis"
                      : "Upgrade to Pro plan to access the competitor analysis tool"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Market Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-500" />
                      Market Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{result.market_analysis.market_size}</div>
                        <div className="text-sm text-gray-600">Market Size</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{result.market_analysis.growth_rate}</div>
                        <div className="text-sm text-gray-600">Growth Rate</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{result.competitors.length}</div>
                        <div className="text-sm text-gray-600">Analyzed</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {result.market_analysis.market_leaders.length}
                        </div>
                        <div className="text-sm text-gray-600">Leaders</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Key Market Trends:</h4>
                      <ul className="space-y-1">
                        {result.market_analysis.key_trends.map((trend, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            {trend}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Competitor Profiles */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-500" />
                      Competitor Profiles ({result.competitors.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {result.competitors.map((competitor, index) => (
                      <div key={index} className="border rounded-lg p-6 bg-white">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-900">{competitor.name}</h3>
                          <Badge variant="secondary">{competitor.website}</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Company Overview */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Company Overview</h4>
                            <div className="space-y-2 text-sm">
                              <p className="text-gray-600">{competitor.overview.description}</p>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="font-medium">Founded:</span> {competitor.overview.founded}
                                </div>
                                <div>
                                  <span className="font-medium">Employees:</span> {competitor.overview.employees}
                                </div>
                                <div className="col-span-2">
                                  <span className="font-medium">Revenue:</span> {competitor.overview.revenue}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Digital Presence */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Digital Presence</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Website Traffic:</span>
                                <span className="text-sm font-medium">
                                  {formatNumber(competitor.digital_presence.website_traffic)}/month
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">SEO Score:</span>
                                <span className="text-sm font-medium">{competitor.digital_presence.seo_score}/100</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Domain Authority:</span>
                                <span className="text-sm font-medium">
                                  {competitor.digital_presence.domain_authority}
                                </span>
                              </div>
                              <div className="pt-2">
                                <span className="text-sm text-gray-600">Social Followers:</span>
                                <div className="grid grid-cols-2 gap-1 mt-1">
                                  <div className="text-xs">
                                    FB: {formatNumber(competitor.digital_presence.social_followers.facebook)}
                                  </div>
                                  <div className="text-xs">
                                    TW: {formatNumber(competitor.digital_presence.social_followers.twitter)}
                                  </div>
                                  <div className="text-xs">
                                    LI: {formatNumber(competitor.digital_presence.social_followers.linkedin)}
                                  </div>
                                  <div className="text-xs">
                                    IG: {formatNumber(competitor.digital_presence.social_followers.instagram)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* SWOT Analysis */}
                        <div className="mt-6">
                          <h4 className="font-medium text-gray-900 mb-3">SWOT Analysis</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                                <Star className="w-4 h-4" /> Strengths
                              </h5>
                              <ul className="space-y-1">
                                {competitor.strengths.map((strength, idx) => (
                                  <li key={idx} className="text-xs text-gray-600">
                                    • {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1">
                                <AlertTriangle className="w-4 h-4" /> Weaknesses
                              </h5>
                              <ul className="space-y-1">
                                {competitor.weaknesses.map((weakness, idx) => (
                                  <li key={idx} className="text-xs text-gray-600">
                                    • {weakness}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Top Keywords */}
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-900 mb-2">Top Keywords</h4>
                          <div className="space-y-2">
                            {competitor.marketing_strategy.top_keywords.map((keyword, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                              >
                                <span>{keyword.keyword}</span>
                                <div className="flex gap-2">
                                  <Badge variant="outline">#{keyword.position}</Badge>
                                  <Badge variant="secondary">{formatNumber(keyword.volume)} vol</Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Competitive Gaps */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-500" />
                      Competitive Gaps & Opportunities ({result.competitive_gaps.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.competitive_gaps.map((gap, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{gap.opportunity}</h4>
                          <div className="flex gap-2">
                            <Badge className={getDifficultyColor(gap.difficulty)}>{gap.difficulty} difficulty</Badge>
                            <Badge className={getImpactColor(gap.impact)}>{gap.impact} impact</Badge>
                          </div>
                        </div>
                        <Badge variant="outline">{gap.category}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Benchmarking */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-500" />
                      Competitive Benchmarking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900">Your Position:</h4>
                      <p className="text-sm text-blue-800">{result.benchmarking.your_position}</p>
                    </div>

                    <div className="space-y-4">
                      {result.benchmarking.key_metrics_comparison.map((metric, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">{metric.metric}</h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <div
                                className={`text-lg font-bold ${getComparisonColor(metric.your_score, metric.competitor_avg)}`}
                              >
                                {formatNumber(metric.your_score)}
                              </div>
                              <div className="text-xs text-gray-600">Your Score</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-600">
                                {formatNumber(metric.competitor_avg)}
                              </div>
                              <div className="text-xs text-gray-600">Competitor Avg</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-600">{formatNumber(metric.industry_avg)}</div>
                              <div className="text-xs text-gray-600">Industry Avg</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Strategic Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                      Strategic Recommendations ({result.recommendations.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.recommendations.map((rec, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{rec.action}</h4>
                          <div className="flex gap-2">
                            <Badge className={getPriorityColor(rec.priority)}>{rec.priority} priority</Badge>
                            <Badge variant="outline">{rec.timeline}</Badge>
                          </div>
                        </div>
                        <Badge variant="secondary" className="mb-2">
                          {rec.category}
                        </Badge>
                        <p className="text-sm text-gray-600">{rec.rationale}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                    className="flex-1"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied!" : "Copy Full Analysis"}
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Download Competitive Report
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
