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
  Megaphone,
  Lock,
  Crown,
  Target,
  TrendingUp,
  Eye,
  MousePointer,
} from "lucide-react"
import { useUserStore } from "@/lib/user-store"

interface AdVariation {
  platform: string
  format: string
  headline: string
  description: string
  cta: string
  character_count: {
    headline: number
    description: number
  }
  compliance_check: {
    passed: boolean
    issues: string[]
  }
}

interface AdCopyResult {
  variations: AdVariation[]
  performance_predictions: {
    expected_ctr: string
    expected_cpc: string
    expected_conversion_rate: string
    quality_score: number
  }
  optimization_tips: Array<{
    category: string
    tip: string
    impact: "high" | "medium" | "low"
  }>
  a_b_test_suggestions: Array<{
    element: string
    variation_a: string
    variation_b: string
    test_hypothesis: string
  }>
  keyword_integration: {
    primary_keywords: string[]
    secondary_keywords: string[]
    keyword_density: number
  }
}

export default function AdCopyPage() {
  const { user } = useUserStore()
  const [formData, setFormData] = useState({
    product: "",
    audience: "",
    platforms: [] as string[],
    objective: "",
    tone: "",
    keywords: "",
    budget: "",
    competitors: "",
    usp: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<AdCopyResult | null>(null)
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({})

  const hasAccess = user.plan !== "Free Trial"

  const platforms = [
    { id: "google", name: "Google Ads", formats: ["Search", "Display", "Shopping"] },
    { id: "facebook", name: "Facebook Ads", formats: ["Feed", "Stories", "Carousel"] },
    { id: "instagram", name: "Instagram Ads", formats: ["Feed", "Stories", "Reels"] },
    { id: "linkedin", name: "LinkedIn Ads", formats: ["Sponsored Content", "Message Ads", "Text Ads"] },
    { id: "twitter", name: "Twitter Ads", formats: ["Promoted Tweets", "Promoted Accounts"] },
    { id: "youtube", name: "YouTube Ads", formats: ["Video", "Display", "Overlay"] },
  ]

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePlatformToggle = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }))
  }

  const handleGenerate = async () => {
    if (!hasAccess) {
      alert("Please upgrade to Pro or Agency plan to use this tool.")
      return
    }

    if (!formData.product || formData.platforms.length === 0) {
      alert("Please enter a product/service and select at least one platform")
      return
    }

    setIsGenerating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 4000))

    // Mock comprehensive ad copy results
    const mockResult: AdCopyResult = {
      variations: formData.platforms.flatMap((platformId) => {
        const platform = platforms.find((p) => p.id === platformId)
        if (!platform) return []

        return platform.formats.map((format) => ({
          platform: platform.name,
          format,
          headline: generateHeadline(formData.product, formData.usp, format),
          description: generateDescription(formData.product, formData.audience, formData.usp, format),
          cta: generateCTA(formData.objective, format),
          character_count: {
            headline: generateHeadline(formData.product, formData.usp, format).length,
            description: generateDescription(formData.product, formData.audience, formData.usp, format).length,
          },
          compliance_check: {
            passed: Math.random() > 0.2,
            issues: Math.random() > 0.7 ? ["Consider avoiding superlatives", "Add disclaimer for claims"] : [],
          },
        }))
      }),
      performance_predictions: {
        expected_ctr: `${(Math.random() * 3 + 2).toFixed(2)}%`,
        expected_cpc: `$${(Math.random() * 2 + 1).toFixed(2)}`,
        expected_conversion_rate: `${(Math.random() * 5 + 3).toFixed(1)}%`,
        quality_score: Math.floor(Math.random() * 3) + 7,
      },
      optimization_tips: [
        {
          category: "Headlines",
          tip: "Include numbers and specific benefits to increase click-through rates",
          impact: "high",
        },
        {
          category: "Call-to-Action",
          tip: "Use action-oriented verbs that create urgency",
          impact: "high",
        },
        {
          category: "Keywords",
          tip: "Integrate primary keywords naturally in headlines for better relevance",
          impact: "medium",
        },
        {
          category: "Audience Targeting",
          tip: "Personalize messaging based on audience demographics and interests",
          impact: "medium",
        },
        {
          category: "Landing Page",
          tip: "Ensure ad copy matches landing page content for better quality scores",
          impact: "high",
        },
      ],
      a_b_test_suggestions: [
        {
          element: "Headline",
          variation_a: 'Benefit-focused: "Save 50% on Premium Software"',
          variation_b: 'Problem-focused: "Stop Wasting Time on Manual Tasks"',
          test_hypothesis: "Problem-focused headlines may resonate better with pain-aware audiences",
        },
        {
          element: "Call-to-Action",
          variation_a: 'Generic: "Learn More"',
          variation_b: 'Specific: "Get Free Demo"',
          test_hypothesis: "Specific CTAs typically outperform generic ones by 20-30%",
        },
        {
          element: "Description",
          variation_a: 'Feature-focused: "Advanced analytics dashboard with real-time reporting"',
          variation_b: 'Benefit-focused: "Make data-driven decisions that boost revenue by 25%"',
          test_hypothesis: "Benefit-focused copy often converts better than feature lists",
        },
      ],
      keyword_integration: {
        primary_keywords: formData.keywords
          .split(",")
          .slice(0, 3)
          .map((k) => k.trim())
          .filter(Boolean),
        secondary_keywords: formData.keywords
          .split(",")
          .slice(3, 8)
          .map((k) => k.trim())
          .filter(Boolean),
        keyword_density: Math.round((Math.random() * 3 + 2) * 10) / 10,
      },
    }

    setResult(mockResult)
    setIsGenerating(false)
  }

  const generateHeadline = (product: string, usp: string, format: string) => {
    const headlines = [
      `Transform Your ${product} Experience Today`,
      `${usp || "Revolutionary"} ${product} Solution`,
      `Get Results with Premium ${product}`,
      `${product} That Actually Works`,
      `Boost Your Success with ${product}`,
      `The Future of ${product} is Here`,
    ]

    if (format.includes("Search")) {
      return headlines[0] + " - Free Trial"
    }

    return headlines[Math.floor(Math.random() * headlines.length)]
  }

  const generateDescription = (product: string, audience: string, usp: string, format: string) => {
    const descriptions = [
      `Discover how ${audience || "thousands of professionals"} are using our ${product} to achieve remarkable results. ${usp || "Proven solution"} with 24/7 support.`,
      `Join ${audience || "successful businesses"} who trust our ${product}. Get started with a free trial and see the difference in just 30 days.`,
      `Stop struggling with outdated ${product}. Our solution helps ${audience || "teams"} save time and increase productivity by up to 40%.`,
      `${usp || "Award-winning"} ${product} designed for ${audience || "modern businesses"}. Easy setup, powerful features, guaranteed results.`,
    ]

    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }

  const generateCTA = (objective: string, format: string) => {
    const ctas = {
      "lead-generation": ["Get Free Quote", "Download Guide", "Start Free Trial", "Request Demo"],
      sales: ["Buy Now", "Shop Today", "Order Now", "Get Yours"],
      traffic: ["Learn More", "Discover How", "See Details", "Find Out More"],
      awareness: ["Explore Now", "See How", "Watch Video", "Learn More"],
    }

    const objectiveCTAs = ctas[objective as keyof typeof ctas] || ctas["traffic"]
    return objectiveCTAs[Math.floor(Math.random() * objectiveCTAs.length)]
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied((prev) => ({ ...prev, [id]: true }))
    setTimeout(() => setCopied((prev) => ({ ...prev, [id]: false })), 2000)
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
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

  const getQualityScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    return "text-red-600"
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
              <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-pink-600 rounded-xl flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Ad Copy Generator</h1>
              {hasAccess ? (
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              ) : (
                <Badge className="bg-orange-100 text-orange-800">Pro Required</Badge>
              )}
            </div>
            <p className="text-gray-600">High-converting ad copy for Google, Facebook, LinkedIn and more platforms</p>
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
                <CardTitle>Ad Campaign Setup</CardTitle>
                <CardDescription>Configure your ad copy parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Product/Service *</Label>
                  <Input
                    id="product"
                    placeholder="AI marketing software, consulting services"
                    value={formData.product}
                    onChange={(e) => handleInputChange("product", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Input
                    id="audience"
                    placeholder="Small business owners, marketing managers"
                    value={formData.audience}
                    onChange={(e) => handleInputChange("audience", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Select Platforms *</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {platforms.map((platform) => (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => handlePlatformToggle(platform.id)}
                        disabled={!hasAccess}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                          formData.platforms.includes(platform.id)
                            ? "border-red-500 bg-red-50 text-red-700"
                            : "border-gray-200 hover:border-red-300"
                        } ${!hasAccess ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <span className="font-medium">{platform.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {platform.formats.length} formats
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objective">Campaign Objective</Label>
                  <select
                    id="objective"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={formData.objective}
                    onChange={(e) => handleInputChange("objective", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select objective</option>
                    <option value="lead-generation">Lead Generation</option>
                    <option value="sales">Drive Sales</option>
                    <option value="traffic">Website Traffic</option>
                    <option value="awareness">Brand Awareness</option>
                    <option value="engagement">Engagement</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Ad Tone</Label>
                  <select
                    id="tone"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={formData.tone}
                    onChange={(e) => handleInputChange("tone", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select tone</option>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual & Friendly</option>
                    <option value="urgent">Urgent & Direct</option>
                    <option value="luxury">Premium & Luxury</option>
                    <option value="playful">Fun & Playful</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Target Keywords</Label>
                  <Textarea
                    id="keywords"
                    placeholder="marketing automation, CRM software, lead generation"
                    value={formData.keywords}
                    onChange={(e) => handleInputChange("keywords", e.target.value)}
                    disabled={!hasAccess}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usp">Unique Selling Proposition</Label>
                  <Input
                    id="usp"
                    placeholder="30% faster results, AI-powered, award-winning"
                    value={formData.usp}
                    onChange={(e) => handleInputChange("usp", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Monthly Ad Budget</Label>
                  <select
                    id="budget"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={formData.budget}
                    onChange={(e) => handleInputChange("budget", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select budget range</option>
                    <option value="under-1k">Under $1,000</option>
                    <option value="1k-5k">$1,000 - $5,000</option>
                    <option value="5k-10k">$5,000 - $10,000</option>
                    <option value="10k-25k">$10,000 - $25,000</option>
                    <option value="over-25k">Over $25,000</option>
                  </select>
                </div>

                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleGenerate}
                    disabled={!hasAccess || isGenerating || !formData.product || formData.platforms.length === 0}
                    className="w-full bg-gradient-to-r from-red-400 to-pink-600 hover:opacity-90 text-white font-semibold py-3"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Ad Copy...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Generate Ad Copy
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
                  <Megaphone className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Create</h3>
                  <p className="text-gray-600">
                    {hasAccess
                      ? "Enter your product details, select platforms, and generate high-converting ad copy"
                      : "Upgrade to Pro plan to access the ad copy generator"}
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
                      Performance Predictions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {result.performance_predictions.expected_ctr}
                        </div>
                        <div className="text-sm text-gray-600">Expected CTR</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {result.performance_predictions.expected_cpc}
                        </div>
                        <div className="text-sm text-gray-600">Expected CPC</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {result.performance_predictions.expected_conversion_rate}
                        </div>
                        <div className="text-sm text-gray-600">Conversion Rate</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div
                          className={`text-2xl font-bold ${getQualityScoreColor(result.performance_predictions.quality_score)}`}
                        >
                          {result.performance_predictions.quality_score}/10
                        </div>
                        <div className="text-sm text-gray-600">Quality Score</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Generated Ad Variations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-red-500" />
                      Generated Ad Variations ({result.variations.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {result.variations.map((variation, index) => (
                      <div key={index} className="border rounded-lg p-6 bg-white">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{variation.platform}</Badge>
                            <Badge variant="outline">{variation.format}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  `${variation.headline}\n\n${variation.description}\n\n${variation.cta}`,
                                  `ad-${index}`,
                                )
                              }
                            >
                              {copied[`ad-${index}`] ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                            {variation.compliance_check.passed ? (
                              <Badge className="bg-green-100 text-green-800">✓ Compliant</Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800">⚠ Review</Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Headline:</h4>
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="font-medium text-blue-900">{variation.headline}</p>
                              <p className="text-xs text-blue-600 mt-1">
                                {variation.character_count.headline} characters
                              </p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Description:</h4>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-gray-700">{variation.description}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {variation.character_count.description} characters
                              </p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Call-to-Action:</h4>
                            <div className="bg-green-50 p-3 rounded-lg">
                              <p className="font-medium text-green-800">{variation.cta}</p>
                            </div>
                          </div>

                          {!variation.compliance_check.passed && variation.compliance_check.issues.length > 0 && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Compliance Issues:</h4>
                              <ul className="space-y-1">
                                {variation.compliance_check.issues.map((issue, idx) => (
                                  <li key={idx} className="text-sm text-yellow-700 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-yellow-500 rounded-full"></span>
                                    {issue}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Keyword Integration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-500" />
                      Keyword Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {result.keyword_integration.primary_keywords.length}
                        </div>
                        <div className="text-sm text-gray-600">Primary Keywords</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {result.keyword_integration.secondary_keywords.length}
                        </div>
                        <div className="text-sm text-gray-600">Secondary Keywords</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {result.keyword_integration.keyword_density}%
                        </div>
                        <div className="text-sm text-gray-600">Keyword Density</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Primary Keywords:</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.keyword_integration.primary_keywords.map((keyword, index) => (
                            <Badge key={index} className="bg-blue-100 text-blue-800">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Secondary Keywords:</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.keyword_integration.secondary_keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* A/B Test Suggestions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MousePointer className="w-5 h-5 text-purple-500" />
                      A/B Test Suggestions ({result.a_b_test_suggestions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.a_b_test_suggestions.map((test, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{test.element} Test</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <h5 className="text-sm font-medium text-blue-700 mb-1">Variation A:</h5>
                            <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">{test.variation_a}</p>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-green-700 mb-1">Variation B:</h5>
                            <p className="text-sm text-gray-600 bg-green-50 p-2 rounded">{test.variation_b}</p>
                          </div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded">
                          <h5 className="text-sm font-medium text-purple-700 mb-1">Test Hypothesis:</h5>
                          <p className="text-sm text-purple-600">{test.test_hypothesis}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Optimization Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                      Optimization Tips ({result.optimization_tips.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.optimization_tips.map((tip, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{tip.category}</h4>
                          <Badge className={getImpactColor(tip.impact)}>{tip.impact} impact</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{tip.tip}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(JSON.stringify(result, null, 2), "all-ads")}
                    className="flex-1"
                  >
                    {copied["all-ads"] ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied["all-ads"] ? "Copied!" : "Copy All Ad Copy"}
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export to CSV
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
