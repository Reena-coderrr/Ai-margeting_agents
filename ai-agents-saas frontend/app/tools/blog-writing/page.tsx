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
  PenTool,
  Lock,
  Crown,
  FileText,
  Target,
  TrendingUp,
  Eye,
} from "lucide-react"
import { useUserStore } from "@/lib/user-store"

interface BlogResult {
  title: string
  metaDescription: string
  content: string
  outline: string[]
  wordCount: number
  readingTime: string
  seoScore: number
  keywords: {
    primary: string
    secondary: string[]
    density: number
  }
  suggestions: {
    improvements: string[]
    additionalSections: string[]
  }
}

export default function BlogWritingPage() {
  const { user } = useUserStore()
  const [formData, setFormData] = useState({
    title: "",
    keywords: "",
    audience: "",
    length: "",
    tone: "",
    outline: "",
    industry: "",
    purpose: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<BlogResult | null>(null)
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

    if (!formData.title || !formData.keywords) {
      alert("Please enter a title and keywords")
      return
    }

    setIsGenerating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 5000))

    // Mock comprehensive blog writing results
    const mockResult: BlogResult = {
      title: formData.title || "The Ultimate Guide to AI-Powered Marketing",
      metaDescription: `Discover how ${formData.keywords || "AI marketing"} can transform your business. Learn proven strategies, tools, and techniques to boost your marketing ROI by 300%.`,
      content: generateBlogContent(formData.title, formData.keywords, formData.audience),
      outline: [
        "Introduction: The AI Marketing Revolution",
        "Understanding AI in Modern Marketing",
        "Key Benefits of AI Marketing Tools",
        "Top AI Marketing Strategies for 2024",
        "Implementation Guide: Getting Started",
        "Measuring Success: KPIs and Analytics",
        "Common Challenges and Solutions",
        "Future Trends in AI Marketing",
        "Conclusion and Next Steps",
      ],
      wordCount: Math.floor(Math.random() * 1000) + 1500,
      readingTime: `${Math.floor((Math.floor(Math.random() * 1000) + 1500) / 200)} min read`,
      seoScore: Math.floor(Math.random() * 20) + 80,
      keywords: {
        primary: formData.keywords.split(",")[0]?.trim() || "AI marketing",
        secondary: formData.keywords
          .split(",")
          .slice(1)
          .map((k) => k.trim()) || ["marketing automation", "digital marketing", "AI tools"],
        density: Math.round((Math.random() * 1.5 + 1.5) * 10) / 10,
      },
      suggestions: {
        improvements: [
          "Add more internal links to related content",
          "Include more data and statistics",
          "Add FAQ section for better user engagement",
          "Consider adding video content or infographics",
        ],
        additionalSections: [
          "Case studies and success stories",
          "Tool comparison table",
          "Step-by-step tutorial",
          "Expert interviews and quotes",
        ],
      },
    }

    setResult(mockResult)
    setIsGenerating(false)
  }

  const generateBlogContent = (title: string, keywords: string, audience: string) => {
    return `# ${title}

## Introduction

In today's rapidly evolving digital landscape, ${keywords || "AI marketing"} has become a game-changer for businesses of all sizes. Whether you're a ${audience || "marketing professional"} looking to stay ahead of the curve or a business owner seeking to maximize your marketing ROI, understanding and implementing AI-powered strategies is no longer optional—it's essential.

## The Current State of AI in Marketing

Artificial Intelligence has revolutionized how we approach marketing, offering unprecedented insights into customer behavior, automating complex processes, and enabling personalization at scale. Recent studies show that companies using AI in their marketing strategies see an average increase of 37% in revenue and 52% faster conversion rates.

### Key Statistics:
- 84% of marketing organizations are implementing or expanding AI usage
- AI can increase marketing productivity by up to 40%
- Personalized experiences driven by AI can boost conversion rates by 19%

## Understanding Your Audience

Before diving into AI implementation, it's crucial to understand your target audience. ${audience ? `For ${audience}, this means` : "This means"} focusing on:

1. **Behavioral Patterns**: How your audience interacts with content
2. **Preferences**: What type of content resonates most
3. **Pain Points**: Challenges they face in their daily work
4. **Goals**: What they're trying to achieve

## AI Marketing Strategies That Work

### 1. Predictive Analytics
Use AI to predict customer behavior and optimize your marketing campaigns accordingly. This includes:
- Customer lifetime value prediction
- Churn prediction and prevention
- Optimal timing for campaigns

### 2. Personalization at Scale
Implement AI-driven personalization to deliver relevant content to each user:
- Dynamic content optimization
- Personalized product recommendations
- Customized email campaigns

### 3. Automated Content Creation
Leverage AI tools for content generation:
- Blog post creation and optimization
- Social media content
- Ad copy generation

## Implementation Guide

### Step 1: Assess Your Current Marketing Stack
Before implementing AI tools, evaluate your existing marketing technology and identify gaps where AI can add value.

### Step 2: Start Small
Begin with one or two AI tools rather than overhauling your entire system. Popular starting points include:
- Email marketing automation
- Social media scheduling
- Basic analytics and reporting

### Step 3: Train Your Team
Ensure your team understands how to use AI tools effectively. This includes:
- Technical training on new platforms
- Understanding AI limitations
- Best practices for AI-human collaboration

## Measuring Success

Track these key metrics to measure the success of your AI marketing initiatives:

- **Conversion Rate**: Percentage of visitors who take desired actions
- **Customer Acquisition Cost (CAC)**: Cost to acquire a new customer
- **Return on Investment (ROI)**: Revenue generated vs. money spent
- **Engagement Metrics**: Time on site, page views, social shares

## Common Challenges and Solutions

### Challenge 1: Data Quality
**Solution**: Implement robust data collection and cleaning processes before deploying AI tools.

### Challenge 2: Integration Issues
**Solution**: Choose AI tools that integrate well with your existing marketing stack.

### Challenge 3: Team Resistance
**Solution**: Provide comprehensive training and demonstrate clear value to gain buy-in.

## Future Trends

The future of AI in marketing looks promising with emerging trends like:
- Voice search optimization
- Visual search capabilities
- Advanced chatbots and conversational AI
- Predictive customer service

## Conclusion

${keywords || "AI marketing"} is not just a trend—it's the future of how businesses will connect with their customers. By starting with the strategies outlined in this guide, ${audience || "marketing professionals"} can begin their journey toward more efficient, effective, and profitable marketing campaigns.

Remember, the key to success with AI marketing is to start small, measure results, and continuously optimize your approach. The tools and strategies that work today will continue to evolve, so staying informed and adaptable is crucial.

## Next Steps

1. Audit your current marketing processes
2. Identify 2-3 areas where AI could have the biggest impact
3. Research and test AI tools that address these areas
4. Measure results and scale successful implementations

Ready to transform your marketing with AI? Start implementing these strategies today and watch your marketing performance soar.`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100"
    if (score >= 60) return "bg-yellow-100"
    return "bg-red-100"
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
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-600 rounded-xl flex items-center justify-center">
                <PenTool className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Blog Writing & Optimization</h1>
              {hasAccess ? (
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              ) : (
                <Badge className="bg-orange-100 text-orange-800">Pro Required</Badge>
              )}
            </div>
            <p className="text-gray-600">AI-powered long-form content creation optimized for search engines</p>
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
                <CardTitle>Blog Configuration</CardTitle>
                <CardDescription>Set up your blog post parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Blog Title *</Label>
                  <Input
                    id="title"
                    placeholder="The Ultimate Guide to AI Marketing"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">SEO Keywords *</Label>
                  <Input
                    id="keywords"
                    placeholder="AI marketing, automation, digital tools"
                    value={formData.keywords}
                    onChange={(e) => handleInputChange("keywords", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Input
                    id="audience"
                    placeholder="Marketing professionals, business owners"
                    value={formData.audience}
                    onChange={(e) => handleInputChange("audience", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="length">Word Count</Label>
                  <select
                    id="length"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.length}
                    onChange={(e) => handleInputChange("length", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select length</option>
                    <option value="500-800">500-800 words</option>
                    <option value="800-1200">800-1200 words</option>
                    <option value="1200-2000">1200-2000 words</option>
                    <option value="2000+">2000+ words</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Writing Tone</Label>
                  <select
                    id="tone"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.tone}
                    onChange={(e) => handleInputChange("tone", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select tone</option>
                    <option value="professional">Professional</option>
                    <option value="conversational">Conversational</option>
                    <option value="authoritative">Authoritative</option>
                    <option value="friendly">Friendly</option>
                    <option value="technical">Technical</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Content Purpose</Label>
                  <select
                    id="purpose"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.purpose}
                    onChange={(e) => handleInputChange("purpose", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select purpose</option>
                    <option value="educational">Educational</option>
                    <option value="promotional">Promotional</option>
                    <option value="thought-leadership">Thought Leadership</option>
                    <option value="how-to-guide">How-to Guide</option>
                    <option value="case-study">Case Study</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="outline">Custom Outline (Optional)</Label>
                  <Textarea
                    id="outline"
                    placeholder="1. Introduction&#10;2. Main Topic&#10;3. Benefits&#10;4. Conclusion"
                    value={formData.outline}
                    onChange={(e) => handleInputChange("outline", e.target.value)}
                    disabled={!hasAccess}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleGenerate}
                    disabled={!hasAccess || isGenerating || !formData.title || !formData.keywords}
                    className="w-full bg-gradient-to-r from-blue-400 to-cyan-600 hover:opacity-90 text-white font-semibold py-3"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Writing Blog Post...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Generate Blog Post
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
                  <PenTool className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Write</h3>
                  <p className="text-gray-600">
                    {hasAccess
                      ? "Enter your blog details and generate SEO-optimized content"
                      : "Upgrade to Pro plan to access the blog writing tool"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Blog Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-500" />
                      Content Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{result.wordCount}</div>
                        <div className="text-sm text-gray-600">Words</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{result.readingTime}</div>
                        <div className="text-sm text-gray-600">Reading Time</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className={`text-2xl font-bold ${getScoreColor(result.seoScore)}`}>
                          {result.seoScore}/100
                        </div>
                        <div className="text-sm text-gray-600">SEO Score</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{result.keywords.density}%</div>
                        <div className="text-sm text-gray-600">Keyword Density</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* SEO Optimization */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      SEO Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Title:</h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium">{result.title}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Meta Description:</h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm">{result.metaDescription}</p>
                        <div className="text-xs text-gray-500 mt-1">{result.metaDescription.length}/160 characters</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Keywords:</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-600">Primary: </span>
                          <Badge className="bg-blue-100 text-blue-800">{result.keywords.primary}</Badge>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Secondary: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.keywords.secondary.map((keyword, index) => (
                              <Badge key={index} variant="secondary">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Content Outline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-500" />
                      Content Outline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-2">
                      {result.outline.map((section, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{section}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>

                {/* Generated Content */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-green-500" />
                        Generated Content
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.content)}>
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{result.content}</pre>
                    </div>
                  </CardContent>
                </Card>

                {/* Suggestions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Content Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Improvements:</h4>
                      <ul className="space-y-1">
                        {result.suggestions.improvements.map((improvement, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Additional Sections to Consider:</h4>
                      <ul className="space-y-1">
                        {result.suggestions.additionalSections.map((section, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                            {section}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => copyToClipboard(result.content)} className="flex-1">
                    {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied!" : "Copy Content"}
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Download as Word Doc
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
