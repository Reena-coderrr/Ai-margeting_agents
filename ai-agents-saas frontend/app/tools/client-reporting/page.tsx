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
  BarChart3,
  Lock,
  Crown,
  TrendingUp,
  Target,
  Calendar,
  DollarSign,
} from "lucide-react"
import { useUserStore } from "@/lib/user-store"

interface ReportMetric {
  name: string
  current: number
  previous: number
  change: number
  unit: string
  trend: "up" | "down" | "stable"
}

interface ReportResult {
  executive_summary: string
  key_metrics: ReportMetric[]
  campaign_performance: Array<{
    name: string
    impressions: number
    clicks: number
    conversions: number
    cost: number
    roi: number
  }>
  recommendations: Array<{
    priority: "high" | "medium" | "low"
    category: string
    title: string
    description: string
    expected_impact: string
  }>
  next_month_goals: Array<{
    metric: string
    target: string
    strategy: string
  }>
  visual_insights: Array<{
    chart_type: string
    title: string
    description: string
    data_points: string[]
  }>
}

export default function ClientReportingPage() {
  const { user } = useUserStore()
  const [formData, setFormData] = useState({
    clientName: "",
    reportPeriod: "",
    campaigns: "",
    goals: "",
    budget: "",
    industry: "",
    kpis: "",
    challenges: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<ReportResult | null>(null)
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

    if (!formData.clientName || !formData.reportPeriod) {
      alert("Please enter client name and report period")
      return
    }

    setIsGenerating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 5500))

    // Mock comprehensive client reporting results
    const mockResult: ReportResult = {
      executive_summary: generateExecutiveSummary(formData.clientName, formData.reportPeriod, formData.goals),
      key_metrics: [
        {
          name: "Website Traffic",
          current: 15420,
          previous: 12350,
          change: 24.9,
          unit: "visitors",
          trend: "up",
        },
        {
          name: "Conversion Rate",
          current: 3.8,
          previous: 2.9,
          change: 31.0,
          unit: "%",
          trend: "up",
        },
        {
          name: "Cost Per Lead",
          current: 42,
          previous: 58,
          change: -27.6,
          unit: "$",
          trend: "up",
        },
        {
          name: "Return on Ad Spend",
          current: 4.2,
          previous: 3.1,
          change: 35.5,
          unit: "x",
          trend: "up",
        },
        {
          name: "Email Open Rate",
          current: 28.5,
          previous: 24.2,
          change: 17.8,
          unit: "%",
          trend: "up",
        },
        {
          name: "Social Engagement",
          current: 892,
          previous: 654,
          change: 36.4,
          unit: "interactions",
          trend: "up",
        },
      ],
      campaign_performance: [
        {
          name: "Google Ads - Brand Campaign",
          impressions: 45200,
          clicks: 1356,
          conversions: 89,
          cost: 3740,
          roi: 4.2,
        },
        {
          name: "Facebook Ads - Lead Gen",
          impressions: 28900,
          clicks: 867,
          conversions: 52,
          cost: 2180,
          roi: 3.8,
        },
        {
          name: "LinkedIn Ads - B2B",
          impressions: 12400,
          clicks: 298,
          conversions: 24,
          cost: 1560,
          roi: 5.1,
        },
      ],
      recommendations: [
        {
          priority: "high",
          category: "Paid Advertising",
          title: "Increase LinkedIn Ad Budget",
          description:
            "LinkedIn campaigns show the highest ROI at 5.1x. Recommend increasing budget by 40% to capitalize on performance.",
          expected_impact: "+25% lead generation",
        },
        {
          priority: "high",
          category: "Website Optimization",
          title: "Improve Landing Page Conversion",
          description: "Current conversion rate of 3.8% can be improved. A/B test new headlines and CTAs.",
          expected_impact: "+15% conversion rate",
        },
        {
          priority: "medium",
          category: "Content Marketing",
          title: "Expand Blog Content",
          description:
            "Organic traffic growth shows potential. Increase blog publishing frequency from 2 to 4 posts per week.",
          expected_impact: "+30% organic traffic",
        },
        {
          priority: "medium",
          category: "Email Marketing",
          title: "Segment Email Lists",
          description: "Current 28.5% open rate can be improved through better segmentation and personalization.",
          expected_impact: "+20% email engagement",
        },
        {
          priority: "low",
          category: "Social Media",
          title: "Increase Video Content",
          description: "Video posts show 2x higher engagement. Recommend creating 2 video posts per week.",
          expected_impact: "+40% social engagement",
        },
      ],
      next_month_goals: [
        {
          metric: "Lead Generation",
          target: "Increase by 30%",
          strategy: "Optimize high-performing campaigns and expand LinkedIn advertising",
        },
        {
          metric: "Conversion Rate",
          target: "Reach 4.5%",
          strategy: "A/B test landing pages and implement conversion optimization tactics",
        },
        {
          metric: "Cost Per Lead",
          target: "Reduce to $35",
          strategy: "Focus budget on highest ROI channels and improve ad targeting",
        },
      ],
      visual_insights: [
        {
          chart_type: "Line Chart",
          title: "Traffic Growth Over Time",
          description: "Shows steady 25% month-over-month growth in website traffic",
          data_points: ["Jan: 12,350", "Feb: 15,420", "Trend: +24.9%"],
        },
        {
          chart_type: "Bar Chart",
          title: "Campaign ROI Comparison",
          description: "LinkedIn ads outperforming other channels with 5.1x ROI",
          data_points: ["Google: 4.2x", "Facebook: 3.8x", "LinkedIn: 5.1x"],
        },
        {
          chart_type: "Pie Chart",
          title: "Traffic Sources",
          description: "Breakdown of traffic sources and their contribution",
          data_points: ["Organic: 45%", "Paid: 35%", "Direct: 15%", "Social: 5%"],
        },
      ],
    }

    setResult(mockResult)
    setIsGenerating(false)
  }

  const generateExecutiveSummary = (clientName: string, period: string, goals: string) => {
    return `## Executive Summary - ${clientName} (${period})

This ${period.toLowerCase()} has been exceptionally strong for ${clientName}, with significant improvements across all key performance indicators. Our strategic focus on data-driven optimization and multi-channel approach has delivered outstanding results.

### Key Highlights:
• **Traffic Growth**: 24.9% increase in website visitors, reaching 15,420 unique visitors
• **Conversion Optimization**: 31% improvement in conversion rate, now at 3.8%
• **Cost Efficiency**: 27.6% reduction in cost per lead, down to $42
• **ROI Performance**: 35.5% increase in return on ad spend, achieving 4.2x ROAS

### Strategic Wins:
1. **LinkedIn Campaign Excellence**: Our B2B LinkedIn campaigns achieved a remarkable 5.1x ROI, significantly outperforming industry benchmarks
2. **Conversion Rate Optimization**: Implemented new landing page designs that increased conversions by 31%
3. **Budget Optimization**: Reallocated spend from underperforming channels to high-ROI campaigns

### Looking Forward:
Based on current momentum and market opportunities, we're positioned to achieve even stronger results next month. Our recommendations focus on scaling successful campaigns and addressing optimization opportunities.

${
  goals
    ? `\n### Progress Toward Goals:\n${goals
        .split(",")
        .map((goal) => `• ${goal.trim()}: On track to exceed targets`)
        .join("\n")}`
    : ""
}

The data clearly shows that our strategic approach is working. We recommend maintaining current successful tactics while implementing the optimization strategies outlined in this report.`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const formatCurrency = (num: number) => {
    return `$${num.toLocaleString()}`
  }

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? "↗️" : trend === "down" ? "↘️" : "➡️"
  }

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"
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
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Client Reporting Agent</h1>
              {hasAccess ? (
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              ) : (
                <Badge className="bg-orange-100 text-orange-800">Pro Required</Badge>
              )}
            </div>
            <p className="text-gray-600">Automated monthly reports with KPI analysis and visual charts</p>
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
                <CardTitle>Report Configuration</CardTitle>
                <CardDescription>Set up your client report parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    placeholder="ABC Company"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange("clientName", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reportPeriod">Report Period *</Label>
                  <select
                    id="reportPeriod"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={formData.reportPeriod}
                    onChange={(e) => handleInputChange("reportPeriod", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select period</option>
                    <option value="January 2024">January 2024</option>
                    <option value="February 2024">February 2024</option>
                    <option value="March 2024">March 2024</option>
                    <option value="Q1 2024">Q1 2024</option>
                    <option value="Q2 2024">Q2 2024</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campaigns">Active Campaigns</Label>
                  <Textarea
                    id="campaigns"
                    placeholder="Google Ads, Facebook Ads, LinkedIn Ads, Email Marketing"
                    value={formData.campaigns}
                    onChange={(e) => handleInputChange("campaigns", e.target.value)}
                    disabled={!hasAccess}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goals">Campaign Goals</Label>
                  <Textarea
                    id="goals"
                    placeholder="Increase leads by 25%, Improve conversion rate, Reduce cost per acquisition"
                    value={formData.goals}
                    onChange={(e) => handleInputChange("goals", e.target.value)}
                    disabled={!hasAccess}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Monthly Budget</Label>
                  <Input
                    id="budget"
                    placeholder="$10,000"
                    value={formData.budget}
                    onChange={(e) => handleInputChange("budget", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <select
                    id="industry"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kpis">Key KPIs to Track</Label>
                  <Input
                    id="kpis"
                    placeholder="Traffic, Conversions, ROI, Cost per Lead"
                    value={formData.kpis}
                    onChange={(e) => handleInputChange("kpis", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleGenerate}
                    disabled={!hasAccess || isGenerating || !formData.clientName || !formData.reportPeriod}
                    className="w-full bg-gradient-to-r from-orange-400 to-red-600 hover:opacity-90 text-white font-semibold py-3"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Generate Client Report
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
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Generate</h3>
                  <p className="text-gray-600">
                    {hasAccess
                      ? "Enter client details and generate comprehensive performance reports"
                      : "Upgrade to Pro plan to access the client reporting tool"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Executive Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-orange-500" />
                        Executive Summary
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.executive_summary)}>
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                        {result.executive_summary}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Key Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {result.key_metrics.map((metric, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{metric.name}</h4>
                            <span className={`text-lg ${getTrendColor(metric.trend)}`}>
                              {getTrendIcon(metric.trend)}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="text-2xl font-bold text-gray-900">
                              {metric.unit === "$"
                                ? formatCurrency(metric.current)
                                : `${formatNumber(metric.current)}${metric.unit !== "visitors" && metric.unit !== "interactions" ? metric.unit : ""}`}
                            </div>
                            <div className={`text-sm ${metric.change > 0 ? "text-green-600" : "text-red-600"}`}>
                              {metric.change > 0 ? "+" : ""}
                              {metric.change.toFixed(1)}% vs previous period
                            </div>
                            <div className="text-xs text-gray-500">
                              Previous:{" "}
                              {metric.unit === "$"
                                ? formatCurrency(metric.previous)
                                : `${formatNumber(metric.previous)}${metric.unit !== "visitors" && metric.unit !== "interactions" ? metric.unit : ""}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Campaign Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-blue-500" />
                      Campaign Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.campaign_performance.map((campaign, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">{campaign.name}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">
                                {formatNumber(campaign.impressions)}
                              </div>
                              <div className="text-xs text-gray-600">Impressions</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-600">{formatNumber(campaign.clicks)}</div>
                              <div className="text-xs text-gray-600">Clicks</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-purple-600">{campaign.conversions}</div>
                              <div className="text-xs text-gray-600">Conversions</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-red-600">{formatCurrency(campaign.cost)}</div>
                              <div className="text-xs text-gray-600">Cost</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-orange-600">{campaign.roi.toFixed(1)}x</div>
                              <div className="text-xs text-gray-600">ROI</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-500" />
                      Strategic Recommendations ({result.recommendations.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.recommendations.map((rec, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{rec.title}</h4>
                          <div className="flex gap-2">
                            <Badge className={getPriorityColor(rec.priority)}>{rec.priority} priority</Badge>
                            <Badge variant="outline">{rec.category}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                        <div className="bg-green-50 p-2 rounded text-sm">
                          <span className="font-medium text-green-800">Expected Impact: </span>
                          <span className="text-green-700">{rec.expected_impact}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Next Month Goals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      Next Month Goals & Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.next_month_goals.map((goal, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{goal.metric}</h4>
                            <Badge className="bg-blue-100 text-blue-800">{goal.target}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{goal.strategy}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Visual Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-green-500" />
                      Visual Insights & Charts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.visual_insights.map((insight, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{insight.chart_type}</Badge>
                            <h4 className="font-medium text-gray-900">{insight.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                          <div className="bg-gray-50 p-3 rounded">
                            <div className="text-xs text-gray-500 mb-1">Data Points:</div>
                            <div className="flex flex-wrap gap-2">
                              {insight.data_points.map((point, idx) => (
                                <span key={idx} className="text-xs bg-white px-2 py-1 rounded border">
                                  {point}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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
                    {copied ? "Copied!" : "Copy Full Report"}
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF Report
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
