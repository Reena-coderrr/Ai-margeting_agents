"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Header } from "@/components/header"
import Link from "next/link"
import { ArrowLeft, Play, Download, Copy, CheckCircle, Loader2, Search, AlertTriangle, TrendingUp } from "lucide-react"

// Types
type CategoryScore = {
  score: number
  issues: number
}

type Issue = {
  type: "error" | "warning" | "info"
  category: string
  message: string
  priority: "High" | "Medium" | "Low"
}

type Recommendation = string

type Keyword = {
  keyword: string
  position: number
  volume: number
  difficulty: number
}

type Competitor = {
  url: string
  score: number
  ranking: number
}

type SEOResult = {
  url: string
  overallScore: number
  categories: Record<string, CategoryScore>
  issues: Issue[]
  recommendations: Recommendation[]
  keywords: Keyword[]
  competitors: Competitor[]
}

export default function SEOAuditPage() {
  const [formData, setFormData] = useState<{ url: string; keywords: string; competitors: string }>({
    url: "",
    keywords: "",
    competitors: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<SEOResult | null>(null)
  const [copied, setCopied] = useState(false)

  const handleInputChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenerate = async () => {
    if (!formData.url) {
      alert("Please enter a website URL")
      return
    }

    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 4000))

    const mockResult: SEOResult = {
      url: formData.url,
      overallScore: 78,
      categories: {
        technical: { score: 85, issues: 3 },
        content: { score: 72, issues: 5 },
        performance: { score: 68, issues: 4 },
        mobile: { score: 90, issues: 1 },
      },
      issues: [
        { type: "error", category: "Technical", message: "Missing meta description on 3 pages", priority: "High" },
        {
          type: "warning",
          category: "Performance",
          message: "Page load speed is 4.2s (should be under 3s)",
          priority: "Medium",
        },
        { type: "warning", category: "Content", message: "5 images missing alt text", priority: "Medium" },
        { type: "info", category: "Technical", message: "Consider implementing schema markup", priority: "Low" },
      ],
      recommendations: [
        "Add meta descriptions to all pages to improve click-through rates",
        "Optimize images and enable compression to improve page speed",
        "Add descriptive alt text to all images for better accessibility",
        "Implement structured data markup for better search visibility",
        "Fix broken internal links found on 2 pages",
      ],
      keywords: formData.keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
        .map((keyword) => ({
          keyword: keyword,
          position: Math.floor(Math.random() * 50) + 1,
          volume: Math.floor(Math.random() * 10000) + 100,
          difficulty: Math.floor(Math.random() * 100),
        })),
      competitors: formData.competitors
        .split("\n")
        .filter(Boolean)
        .map((comp) => ({
          url: comp.trim(),
          score: Math.floor(Math.random() * 40) + 60,
          ranking: Math.floor(Math.random() * 10) + 1,
        })),
    }

    setResult(mockResult)
    setIsGenerating(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/tools" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-400 to-emerald-600 flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SEO Audit Tool</h1>
              <p className="text-gray-600">Comprehensive website SEO analysis with actionable insights</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Website Analysis</CardTitle>
              <CardDescription>Enter your website details for comprehensive SEO audit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Website URL *</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.url}
                  onChange={(e) => handleInputChange("url", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Target Keywords (comma-separated)</Label>
                <Input
                  id="keywords"
                  placeholder="marketing, SEO, digital marketing"
                  value={formData.keywords}
                  onChange={(e) => handleInputChange("keywords", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="competitors">Competitor URLs (one per line)</Label>
                <Textarea
                  id="competitors"
                  placeholder="https://competitor1.com&#10;https://competitor2.com"
                  value={formData.competitors}
                  onChange={(e) => handleInputChange("competitors", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-green-400 to-emerald-600 hover:opacity-90 text-white font-semibold py-3"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Website...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start SEO Audit
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Results</CardTitle>
              <CardDescription>Your comprehensive SEO analysis report</CardDescription>
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="text-center py-12 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Enter your website URL and click "Start SEO Audit"</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <div className="text-4xl font-bold text-green-600 mb-2">{result.overallScore}/100</div>
                    <div className="text-gray-600">Overall SEO Score</div>
                    <Progress value={result.overallScore} className="mt-3" />
                  </div>

                  {/* Category Scores */}
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(result.categories).map(([category, data]) => (
                      <div key={category} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium capitalize">{category}</span>
                          <Badge
                            variant={data.score >= 80 ? "default" : data.score >= 60 ? "secondary" : "destructive"}
                          >
                            {data.score}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">{data.issues} issues found</div>
                      </div>
                    ))}
                  </div>

                  {/* Issues */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      Issues Found
                    </h4>
                    <div className="space-y-2">
                      {result.issues.map((issue, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              issue.type === "error"
                                ? "bg-red-500"
                                : issue.type === "warning"
                                ? "bg-orange-500"
                                : "bg-blue-500"
                            }`}
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{issue.message}</div>
                            <div className="text-xs text-gray-500">
                              {issue.category} • {issue.priority} Priority
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}>
                      <Copy className="w-4 h-4 mr-2" />
                      {copied ? "Copied!" : "Copy Report"}
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
