"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Globe, Zap, Copy, Download, Sparkles, Target, TrendingUp, AlertTriangle, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function LandingPageOptimizerPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [formData, setFormData] = useState({
    url: "",
    industry: "",
    goal: "",
    targetAudience: "",
  })

  const analyzePageOptimization = async () => {
    if (!formData.url) return

    setIsAnalyzing(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 4000))

    const mockResults = {
      overview: {
        overallScore: 72,
        conversionPotential: "High",
        trafficQuality: "Good",
        userExperience: "Needs Improvement",
      },
      performance: {
        loadTime: 3.2,
        mobileScore: 68,
        desktopScore: 85,
        coreWebVitals: {
          lcp: 2.1,
          fid: 45,
          cls: 0.08,
        },
      },
      seoAnalysis: {
        titleTag: {
          current: "Welcome to Our Amazing Product",
          score: 65,
          issues: ["Missing target keywords", "Could be more compelling"],
          suggestion: "Best Digital Marketing Software - Boost ROI by 300%",
        },
        metaDescription: {
          current: "We offer great services for your business needs.",
          score: 45,
          issues: ["Too generic", "Missing call-to-action", "No value proposition"],
          suggestion:
            "Transform your marketing with AI-powered tools. Get 14-day free trial. Join 10,000+ successful businesses.",
        },
        headings: {
          h1: {
            current: "Welcome to Our Platform",
            score: 50,
            suggestion: "Increase Your Sales by 300% with AI Marketing Tools",
          },
          structure: "Needs improvement - missing H2 and H3 hierarchy",
        },
      },
      conversionOptimization: {
        headline: {
          current: "Welcome to Our Platform",
          score: 45,
          issues: ["Not benefit-focused", "Lacks urgency", "Generic messaging"],
          suggestions: [
            "Double Your Sales in 30 Days with AI Marketing",
            "Join 10,000+ Businesses Growing 300% Faster",
            "Stop Losing Customers - Start Converting Today",
          ],
        },
        cta: {
          current: "Learn More",
          score: 30,
          issues: ["Weak action verb", "No value indication", "Not prominent enough"],
          suggestions: ["Start Free 14-Day Trial", "Get My Free Marketing Audit", "Double My Sales Now"],
        },
        valueProposition: {
          score: 55,
          issues: ["Not clear enough", "Benefits not quantified", "Missing social proof"],
          suggestions: [
            "Add specific numbers and results",
            "Include customer testimonials",
            "Highlight unique differentiators",
          ],
        },
      },
      userExperience: {
        navigation: {
          score: 70,
          issues: ["Menu could be clearer", "Missing breadcrumbs"],
          suggestions: ["Simplify navigation labels", "Add search functionality"],
        },
        forms: {
          score: 60,
          issues: ["Too many fields", "No progress indicators", "Unclear error messages"],
          suggestions: ["Reduce form fields to essentials", "Add form validation", "Use multi-step forms"],
        },
        trust: {
          score: 65,
          issues: ["Missing security badges", "No customer reviews visible", "Contact info not prominent"],
          suggestions: ["Add SSL certificates display", "Show customer testimonials", "Add live chat"],
        },
      },
      competitorAnalysis: {
        averageScore: 68,
        yourPosition: "Above Average",
        topPerformers: [
          { name: "Competitor A", score: 89, strength: "Excellent mobile experience" },
          { name: "Competitor B", score: 82, strength: "Strong conversion optimization" },
          { name: "Competitor C", score: 78, strength: "Great content strategy" },
        ],
      },
      recommendations: {
        immediate: [
          {
            priority: "High",
            task: "Optimize page load speed",
            impact: "High",
            effort: "Medium",
            description: "Compress images and minify CSS/JS to improve load time from 3.2s to under 2s",
          },
          {
            priority: "High",
            task: "Rewrite headline and CTA",
            impact: "High",
            effort: "Low",
            description: "Use benefit-focused headline and action-oriented CTA buttons",
          },
          {
            priority: "Medium",
            task: "Add social proof elements",
            impact: "Medium",
            effort: "Low",
            description: "Include customer testimonials, reviews, and trust badges",
          },
        ],
        longTerm: [
          {
            priority: "Medium",
            task: "Implement A/B testing",
            impact: "High",
            effort: "High",
            description: "Set up systematic testing for headlines, CTAs, and page layouts",
          },
          {
            priority: "Low",
            task: "Mobile experience overhaul",
            impact: "Medium",
            effort: "High",
            description: "Redesign mobile layout for better user experience",
          },
        ],
      },
      projectedImprovements: {
        conversionRate: {
          current: "2.3%",
          projected: "4.1%",
          increase: "+78%",
        },
        bounceRate: {
          current: "68%",
          projected: "45%",
          improvement: "-34%",
        },
        avgSessionDuration: {
          current: "1:23",
          projected: "2:45",
          increase: "+99%",
        },
      },
    }

    setResults(mockResults)
    setIsAnalyzing(false)
  }

  const copyReport = () => {
    const reportText = JSON.stringify(results, null, 2)
    navigator.clipboard.writeText(reportText)
  }

  const downloadReport = () => {
    const reportData = JSON.stringify(results, null, 2)
    const blob = new Blob([reportData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "landing-page-optimization-report.json"
    a.click()
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50"
    if (score >= 60) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/tools" className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-4 py-2 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tools
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-400 to-red-600 flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Landing Page Optimizer</h1>
            <p className="text-gray-600">Analyze and optimize your landing pages for maximum conversions</p>
          </div>
        </div>
      </div>
      
      <Alert className="mb-8">
        <Zap className="h-4 w-4" />
        <AlertDescription>
          <strong>Pro Feature:</strong> This tool requires a Pro or Agency plan for full access.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Page Analysis Setup
              </CardTitle>
              <CardDescription>Enter your landing page details for optimization analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="url">Landing Page URL *</Label>
                <Input
                  id="url"
                  placeholder="https://yoursite.com/landing-page"
                  value={formData.url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="e.g., SaaS, E-commerce, Healthcare"
                  value={formData.industry}
                  onChange={(e) => setFormData((prev) => ({ ...prev, industry: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="goal">Primary Goal</Label>
                <Input
                  id="goal"
                  placeholder="e.g., Generate leads, Drive sales, Sign-ups"
                  value={formData.goal}
                  onChange={(e) => setFormData((prev) => ({ ...prev, goal: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="audience">Target Audience</Label>
                <Textarea
                  id="audience"
                  placeholder="Describe your target audience demographics and behavior"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData((prev) => ({ ...prev, targetAudience: e.target.value }))}
                />
              </div>

              <Button onClick={analyzePageOptimization} disabled={isAnalyzing || !formData.url} className="w-full">
                {isAnalyzing ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Page...
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-4 w-4" />
                    Analyze Landing Page
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {isAnalyzing && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 animate-spin" />
                    <span>Analyzing your landing page...</span>
                  </div>
                  <Progress value={80} />
                  <p className="text-sm text-muted-foreground">
                    Checking performance, SEO, conversion elements, and user experience...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {results && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Optimization Overview
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={copyReport}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline" onClick={downloadReport}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className={`text-center p-4 rounded-lg ${getScoreColor(results.overview.overallScore)}`}>
                      <div className="text-2xl font-bold">{results.overview.overallScore}/100</div>
                      <div className="text-sm">Overall Score</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{results.overview.conversionPotential}</div>
                      <div className="text-sm text-blue-600">Conversion Potential</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{results.overview.trafficQuality}</div>
                      <div className="text-sm text-green-600">Traffic Quality</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-lg font-bold text-yellow-600">{results.overview.userExperience}</div>
                      <div className="text-sm text-yellow-600">User Experience</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Tabs defaultValue="performance" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="performance">Performance</TabsTrigger>
                      <TabsTrigger value="seo">SEO</TabsTrigger>
                      <TabsTrigger value="conversion">Conversion</TabsTrigger>
                      <TabsTrigger value="ux">User Experience</TabsTrigger>
                      <TabsTrigger value="recommendations">Actions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="performance" className="space-y-4">
                      <h3 className="text-lg font-semibold">Performance Analysis</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">Page Speed</h4>
                            <div className="flex items-center justify-between mb-2">
                              <span>Load Time:</span>
                              <span className="font-bold text-red-600">{results.performance.loadTime}s</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Target: Under 2 seconds for optimal conversion
                            </div>
                          </div>

                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">Mobile vs Desktop</h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span>Mobile Score:</span>
                                <span
                                  className={`font-bold ${results.performance.mobileScore >= 80 ? "text-green-600" : results.performance.mobileScore >= 60 ? "text-yellow-600" : "text-red-600"}`}
                                >
                                  {results.performance.mobileScore}/100
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Desktop Score:</span>
                                <span
                                  className={`font-bold ${results.performance.desktopScore >= 80 ? "text-green-600" : results.performance.desktopScore >= 60 ? "text-yellow-600" : "text-red-600"}`}
                                >
                                  {results.performance.desktopScore}/100
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">Core Web Vitals</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>LCP (Loading):</span>
                                <span className="font-medium">{results.performance.coreWebVitals.lcp}s</span>
                              </div>
                              <div className="flex justify-between">
                                <span>FID (Interactivity):</span>
                                <span className="font-medium">{results.performance.coreWebVitals.fid}ms</span>
                              </div>
                              <div className="flex justify-between">
                                <span>CLS (Visual Stability):</span>
                                <span className="font-medium">{results.performance.coreWebVitals.cls}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="seo" className="space-y-4">
                      <h3 className="text-lg font-semibold">SEO Analysis</h3>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Title Tag</h4>
                            <Badge className={getScoreColor(results.seoAnalysis.titleTag.score)}>
                              {results.seoAnalysis.titleTag.score}/100
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Current:</span>
                              <div className="font-medium">{results.seoAnalysis.titleTag.current}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Issues:</span>
                              <ul className="list-disc list-inside text-red-600">
                                {results.seoAnalysis.titleTag.issues.map((issue: string, index: number) => (
                                  <li key={index}>{issue}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Suggestion:</span>
                              <div className="font-medium text-green-600">
                                {results.seoAnalysis.titleTag.suggestion}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Meta Description</h4>
                            <Badge className={getScoreColor(results.seoAnalysis.metaDescription.score)}>
                              {results.seoAnalysis.metaDescription.score}/100
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Current:</span>
                              <div className="font-medium">{results.seoAnalysis.metaDescription.current}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Issues:</span>
                              <ul className="list-disc list-inside text-red-600">
                                {results.seoAnalysis.metaDescription.issues.map((issue: string, index: number) => (
                                  <li key={index}>{issue}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Suggestion:</span>
                              <div className="font-medium text-green-600">
                                {results.seoAnalysis.metaDescription.suggestion}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Heading Structure</h4>
                            <Badge className={getScoreColor(results.seoAnalysis.headings.h1.score)}>
                              {results.seoAnalysis.headings.h1.score}/100
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Current H1:</span>
                              <div className="font-medium">{results.seoAnalysis.headings.h1.current}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Suggested H1:</span>
                              <div className="font-medium text-green-600">
                                {results.seoAnalysis.headings.h1.suggestion}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Structure:</span>
                              <div className="text-red-600">{results.seoAnalysis.headings.structure}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="conversion" className="space-y-4">
                      <h3 className="text-lg font-semibold">Conversion Optimization</h3>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Headline</h4>
                            <Badge className={getScoreColor(results.conversionOptimization.headline.score)}>
                              {results.conversionOptimization.headline.score}/100
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Current:</span>
                              <div className="font-medium">{results.conversionOptimization.headline.current}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Issues:</span>
                              <ul className="list-disc list-inside text-red-600">
                                {results.conversionOptimization.headline.issues.map((issue: string, index: number) => (
                                  <li key={index}>{issue}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Suggestions:</span>
                              <ul className="list-disc list-inside text-green-600">
                                {results.conversionOptimization.headline.suggestions.map(
                                  (suggestion: string, index: number) => (
                                    <li key={index}>{suggestion}</li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Call-to-Action</h4>
                            <Badge className={getScoreColor(results.conversionOptimization.cta.score)}>
                              {results.conversionOptimization.cta.score}/100
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Current:</span>
                              <div className="font-medium">{results.conversionOptimization.cta.current}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Issues:</span>
                              <ul className="list-disc list-inside text-red-600">
                                {results.conversionOptimization.cta.issues.map((issue: string, index: number) => (
                                  <li key={index}>{issue}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Suggestions:</span>
                              <ul className="list-disc list-inside text-green-600">
                                {results.conversionOptimization.cta.suggestions.map(
                                  (suggestion: string, index: number) => (
                                    <li key={index}>{suggestion}</li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Value Proposition</h4>
                            <Badge className={getScoreColor(results.conversionOptimization.valueProposition.score)}>
                              {results.conversionOptimization.valueProposition.score}/100
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Issues:</span>
                              <ul className="list-disc list-inside text-red-600">
                                {results.conversionOptimization.valueProposition.issues.map(
                                  (issue: string, index: number) => (
                                    <li key={index}>{issue}</li>
                                  ),
                                )}
                              </ul>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Suggestions:</span>
                              <ul className="list-disc list-inside text-green-600">
                                {results.conversionOptimization.valueProposition.suggestions.map(
                                  (suggestion: string, index: number) => (
                                    <li key={index}>{suggestion}</li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="ux" className="space-y-4">
                      <h3 className="text-lg font-semibold">User Experience Analysis</h3>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Navigation</h4>
                            <Badge className={getScoreColor(results.userExperience.navigation.score)}>
                              {results.userExperience.navigation.score}/100
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Issues:</span>
                              <ul className="list-disc list-inside text-red-600">
                                {results.userExperience.navigation.issues.map((issue: string, index: number) => (
                                  <li key={index}>{issue}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Suggestions:</span>
                              <ul className="list-disc list-inside text-green-600">
                                {results.userExperience.navigation.suggestions.map(
                                  (suggestion: string, index: number) => (
                                    <li key={index}>{suggestion}</li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Forms</h4>
                            <Badge className={getScoreColor(results.userExperience.forms.score)}>
                              {results.userExperience.forms.score}/100
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Issues:</span>
                              <ul className="list-disc list-inside text-red-600">
                                {results.userExperience.forms.issues.map((issue: string, index: number) => (
                                  <li key={index}>{issue}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Suggestions:</span>
                              <ul className="list-disc list-inside text-green-600">
                                {results.userExperience.forms.suggestions.map((suggestion: string, index: number) => (
                                  <li key={index}>{suggestion}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Trust & Credibility</h4>
                            <Badge className={getScoreColor(results.userExperience.trust.score)}>
                              {results.userExperience.trust.score}/100
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Issues:</span>
                              <ul className="list-disc list-inside text-red-600">
                                {results.userExperience.trust.issues.map((issue: string, index: number) => (
                                  <li key={index}>{issue}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Suggestions:</span>
                              <ul className="list-disc list-inside text-green-600">
                                {results.userExperience.trust.suggestions.map((suggestion: string, index: number) => (
                                  <li key={index}>{suggestion}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="recommendations" className="space-y-4">
                      <h3 className="text-lg font-semibold">Action Plan</h3>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            Immediate Actions (Next 7 Days)
                          </h4>
                          <div className="space-y-3">
                            {results.recommendations.immediate.map((rec: any, index: number) => (
                              <div key={index} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <h5 className="font-medium">{rec.task}</h5>
                                  <div className="flex gap-2">
                                    <Badge className={getPriorityColor(rec.priority)}>{rec.priority}</Badge>
                                    <Badge variant="outline">Impact: {rec.impact}</Badge>
                                    <Badge variant="outline">Effort: {rec.effort}</Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">{rec.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Target className="h-4 w-4 text-blue-500" />
                            Long-term Improvements (Next 30 Days)
                          </h4>
                          <div className="space-y-3">
                            {results.recommendations.longTerm.map((rec: any, index: number) => (
                              <div key={index} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <h5 className="font-medium">{rec.task}</h5>
                                  <div className="flex gap-2">
                                    <Badge className={getPriorityColor(rec.priority)}>{rec.priority}</Badge>
                                    <Badge variant="outline">Impact: {rec.impact}</Badge>
                                    <Badge variant="outline">Effort: {rec.effort}</Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">{rec.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Projected Improvements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Conversion Rate</div>
                      <div className="text-lg font-bold text-gray-600">
                        {results.projectedImprovements.conversionRate.current}
                      </div>
                      <div className="text-sm text-muted-foreground">↓</div>
                      <div className="text-2xl font-bold text-green-600">
                        {results.projectedImprovements.conversionRate.projected}
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        {results.projectedImprovements.conversionRate.increase}
                      </div>
                    </div>

                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Bounce Rate</div>
                      <div className="text-lg font-bold text-gray-600">
                        {results.projectedImprovements.bounceRate.current}
                      </div>
                      <div className="text-sm text-muted-foreground">↓</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {results.projectedImprovements.bounceRate.projected}
                      </div>
                      <div className="text-sm font-medium text-blue-600">
                        {results.projectedImprovements.bounceRate.improvement}
                      </div>
                    </div>

                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Session Duration</div>
                      <div className="text-lg font-bold text-gray-600">
                        {results.projectedImprovements.avgSessionDuration.current}
                      </div>
                      <div className="text-sm text-muted-foreground">↓</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {results.projectedImprovements.avgSessionDuration.projected}
                      </div>
                      <div className="text-sm font-medium text-purple-600">
                        {results.projectedImprovements.avgSessionDuration.increase}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Competitor Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Your Landing Page</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-blue-600">{results.overview.overallScore}</span>
                        <Badge variant="outline">{results.competitorAnalysis.yourPosition}</Badge>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground mb-2">
                      Industry Average: {results.competitorAnalysis.averageScore}/100
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Top Performers in Your Industry:</h4>
                      {results.competitorAnalysis.topPerformers.map((competitor: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <span className="font-medium">{competitor.name}</span>
                            <div className="text-sm text-muted-foreground">{competitor.strength}</div>
                          </div>
                          <span className="font-bold">{competitor.score}/100</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!results && !isAnalyzing && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter your landing page URL to start the optimization analysis</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
