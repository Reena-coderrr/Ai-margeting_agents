"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Header } from "@/components/header"
import Link from "next/link"
import { 
  ArrowLeft, 
  Play, 
  Download, 
  Copy, 
  CheckCircle, 
  Loader2, 
  Search, 
  AlertTriangle, 
  X,
  Info,
  Clock,
  Zap,
  Shield,
  Smartphone,
  FileText,
  Globe,
  Image,
  Code,
  Gauge,
  Eye
} from "lucide-react"
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";

// Types
type TestStatus = "pass" | "fail" | "warning" | "info"

type TestResult = {
  status: TestStatus
  percentage: string
  description: string
  details?: any
  howToFix?: string
  url?: string
}

type SEOSummary = {
  score: number
  failed: number
  warnings: number
  passed: number
  criticalIssues?: number
  improvementOpportunities?: number
}

type TechnicalSEO = {
  metaTitle: TestResult
  metaDescription: TestResult
  headingStructure: TestResult
  images: TestResult
  internalLinks: TestResult
  canonicalTags: TestResult
  schemaMarkup: TestResult
  robotsTxt: TestResult
  sitemap: TestResult
}

type Performance = {
  pageSpeed: TestResult
  coreWebVitals: TestResult
  compression: TestResult
}

type Security = {
  https: TestResult
  securityHeaders: TestResult
}

type MobileUsability = {
  responsiveDesign: TestResult
  touchTargets: TestResult
  mobileSpeed: TestResult
}

type ContentQuality = {
  readability: TestResult
  keywordOptimization: TestResult
  contentUniqueness: TestResult
}

type Accessibility = {
  altText: TestResult
  ariaLabels: TestResult
  navigation: TestResult
}

type URLStructure = {
  seoFriendly: TestResult
}

type Recommendation = {
  category: string
  priority: "critical" | "high" | "medium" | "low"
  title: string
  description: string
  action: string
  impact?: "high" | "medium" | "low"
  effort?: "high" | "medium" | "low"
  timeline?: "immediate" | "1-2 weeks" | "1-3 months"
}

type PriorityAction = {
  category: string
  action: string
  priority: "critical" | "high" | "medium" | "low"
  effort: "high" | "medium" | "low"
  impact: "high" | "medium" | "low"
}

type SEOResult = {
  overallScore: number
  summary: SEOSummary
  technicalSEO: TechnicalSEO
  performance: Performance
  security: Security
  mobileUsability: MobileUsability
  contentQuality: ContentQuality
  accessibility: Accessibility
  urlStructure: URLStructure
  recommendations: Recommendation[]
  priorityActions: PriorityAction[]
}

export default function SEOAuditPage() {
  const [formData, setFormData] = useState<{ url: string }>({
    url: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<SEOResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        let plan = parsed.subscription?.plan || parsed.plan || null;
        if (plan) {
          plan = plan.toLowerCase().replace(/\s+/g, "_");
        }
        setUserPlan(plan);
      } catch {}
    }
  }, []);

  const handleInputChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenerate = async () => {
    if (!formData.url) {
      alert("Please enter a website URL")
      return
    }

    setIsGenerating(true)
    const token = localStorage.getItem("authToken")
    
    try {
      const res = await fetch("http://localhost:5000/api/ai-tools/seo-audit/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ input: formData }),
      })
      const data = await res.json()
      
      if (res.ok) {
        if (data.output && data.output.error) {
          alert(`SEO Audit failed: ${data.output.error}`)
          return
        }
        
        if (data.output && typeof data.output.overallScore === 'number') {
          console.log('Setting SEO audit result:', data.output);
          setResult(data.output)
        } else if (data.output && data.output.error) {
          alert(`SEO Audit failed: ${data.output.error}`)
        } else {
          console.log('Invalid SEO audit data received:', data);
          alert("Invalid SEO audit data received. Please try again.")
        }
      } else {
        alert(data.message || "Failed to generate SEO audit")
      }
    } catch (error) {
      console.error("SEO Audit error:", error)
      alert("Network error. Please check your connection and try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadPDF = () => {
    if (!result) return;
    
    const doc = new jsPDF();
    let yPosition = 20;
    
    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text("Comprehensive SEO Audit Report", 20, yPosition);
    yPosition += 15;
    
    // Website Info
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Website: ${formData.url}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Overall Score: ${result.overallScore}/100`, 20, yPosition);
    yPosition += 15;
    
    // Summary
    if (result.summary) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text("Audit Summary", 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text(`Passed: ${result.summary.passed}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Warnings: ${result.summary.warnings}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Failed: ${result.summary.failed}`, 25, yPosition);
      yPosition += 6;
      if (result.summary.criticalIssues) {
        doc.text(`Critical Issues: ${result.summary.criticalIssues}`, 25, yPosition);
        yPosition += 6;
      }
      yPosition += 10;
    }
    
    // Technical SEO
    if (result.technicalSEO) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text("Technical SEO Analysis", 20, yPosition);
      yPosition += 10;
      
      Object.entries(result.technicalSEO).forEach(([key, test]) => {
        if (typeof test === 'object' && test !== null) {
          doc.setFontSize(11);
          doc.setFont(undefined, 'bold');
          doc.text(`${key.replace(/([A-Z])/g, ' $1').trim()}: ${test.status.toUpperCase()}`, 25, yPosition);
          yPosition += 6;
          
          doc.setFontSize(10);
          doc.setFont(undefined, 'normal');
          doc.text(test.description, 30, yPosition);
          yPosition += 6;
        }
      });
      yPosition += 10;
    }
    
    // Performance
    if (result.performance) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text("Performance Analysis", 20, yPosition);
      yPosition += 10;
      
      Object.entries(result.performance).forEach(([key, test]) => {
        if (typeof test === 'object' && test !== null) {
          doc.setFontSize(11);
          doc.setFont(undefined, 'bold');
          doc.text(`${key.replace(/([A-Z])/g, ' $1').trim()}: ${test.status.toUpperCase()}`, 25, yPosition);
          yPosition += 6;
          
          doc.setFontSize(10);
          doc.setFont(undefined, 'normal');
          doc.text(test.description, 30, yPosition);
          yPosition += 6;
        }
      });
      yPosition += 10;
    }
    
    // Security
    if (result.security) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text("Security Analysis", 20, yPosition);
      yPosition += 10;
      
      Object.entries(result.security).forEach(([key, test]) => {
        if (typeof test === 'object' && test !== null) {
          doc.setFontSize(11);
          doc.setFont(undefined, 'bold');
          doc.text(`${key.replace(/([A-Z])/g, ' $1').trim()}: ${test.status.toUpperCase()}`, 25, yPosition);
          yPosition += 6;
          
          doc.setFontSize(10);
          doc.setFont(undefined, 'normal');
          doc.text(test.description, 30, yPosition);
          yPosition += 6;
        }
      });
      yPosition += 10;
    }
    
    // Mobile Usability
    if (result.mobileUsability) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text("Mobile Usability", 20, yPosition);
      yPosition += 10;
      
      Object.entries(result.mobileUsability).forEach(([key, test]) => {
        if (typeof test === 'object' && test !== null) {
          doc.setFontSize(11);
          doc.setFont(undefined, 'bold');
          doc.text(`${key.replace(/([A-Z])/g, ' $1').trim()}: ${test.status.toUpperCase()}`, 25, yPosition);
          yPosition += 6;
          
          doc.setFontSize(10);
          doc.setFont(undefined, 'normal');
          doc.text(test.description, 30, yPosition);
          yPosition += 6;
        }
      });
      yPosition += 10;
    }
    
    // Content Quality
    if (result.contentQuality) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text("Content Quality Analysis", 20, yPosition);
      yPosition += 10;
      
      Object.entries(result.contentQuality).forEach(([key, test]) => {
        if (typeof test === 'object' && test !== null) {
          doc.setFontSize(11);
          doc.setFont(undefined, 'bold');
          doc.text(`${key.replace(/([A-Z])/g, ' $1').trim()}: ${test.status.toUpperCase()}`, 25, yPosition);
          yPosition += 6;
          
          doc.setFontSize(10);
          doc.setFont(undefined, 'normal');
          doc.text(test.description, 30, yPosition);
          yPosition += 6;
        }
      });
      yPosition += 10;
    }
    
    // Accessibility
    if (result.accessibility) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text("Accessibility Analysis", 20, yPosition);
      yPosition += 10;
      
      Object.entries(result.accessibility).forEach(([key, test]) => {
        if (typeof test === 'object' && test !== null) {
          doc.setFontSize(11);
          doc.setFont(undefined, 'bold');
          doc.text(`${key.replace(/([A-Z])/g, ' $1').trim()}: ${test.status.toUpperCase()}`, 25, yPosition);
          yPosition += 6;
          
          doc.setFontSize(10);
          doc.setFont(undefined, 'normal');
          doc.text(test.description, 30, yPosition);
          yPosition += 6;
        }
      });
      yPosition += 10;
    }
    
    // URL Structure
    if (result.urlStructure) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text("URL Structure Analysis", 20, yPosition);
      yPosition += 10;
      
      Object.entries(result.urlStructure).forEach(([key, test]) => {
        if (typeof test === 'object' && test !== null) {
          doc.setFontSize(11);
          doc.setFont(undefined, 'bold');
          doc.text(`${key.replace(/([A-Z])/g, ' $1').trim()}: ${test.status.toUpperCase()}`, 25, yPosition);
          yPosition += 6;
          
          doc.setFontSize(10);
          doc.setFont(undefined, 'normal');
          doc.text(test.description, 30, yPosition);
          yPosition += 6;
        }
      });
      yPosition += 10;
    }
    
    // Priority Actions
    if (result.priorityActions && result.priorityActions.length > 0) {
      doc.addPage();
      yPosition = 20;
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text("Priority Actions", 20, yPosition);
      yPosition += 10;
      
      result.priorityActions.forEach((action, index) => {
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(`${index + 1}. ${action.action}`, 20, yPosition);
        yPosition += 6;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Priority: ${action.priority} | Impact: ${action.impact} | Effort: ${action.effort}`, 25, yPosition);
        yPosition += 6;
        doc.text(`Category: ${action.category}`, 25, yPosition);
        yPosition += 8;
      });
      yPosition += 10;
    }
    
    // Recommendations
    if (result.recommendations && result.recommendations.length > 0) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text("Detailed Recommendations", 20, yPosition);
      yPosition += 10;
      
      result.recommendations.forEach((rec, index) => {
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(`${index + 1}. ${rec.title}`, 20, yPosition);
        yPosition += 6;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Priority: ${rec.priority}`, 25, yPosition);
        yPosition += 6;
        doc.text(`Category: ${rec.category}`, 25, yPosition);
        yPosition += 6;
        doc.text(`Description: ${rec.description}`, 25, yPosition);
        yPosition += 6;
        doc.text(`Action: ${rec.action}`, 25, yPosition);
        yPosition += 8;
      });
    }
    
    doc.save("comprehensive-seo-audit-report.pdf");
  };

  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "fail":
        return <X className="w-5 h-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: TestStatus) => {
    switch (status) {
      case "pass":
        return "text-green-600"
      case "fail":
        return "text-red-600"
      case "warning":
        return "text-yellow-600"
      case "info":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const backHref = userPlan === "free_trial" ? "/dashboard" : "/tools";
  const backText = userPlan === "free_trial" ? "Back to Dashboard" : "Back to Tools";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href={backHref} className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-4 py-2 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {backText}
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

                  {/* Summary Stats */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-500">{result.summary?.failed || 0}</div>
                      <div className="text-xs text-gray-500">Failed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-500">{result.summary?.warnings || 0}</div>
                      <div className="text-xs text-gray-500">Warnings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">{result.summary?.passed || 0}</div>
                      <div className="text-xs text-gray-500">Passed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">{result.summary?.score || 0}</div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Results */}
        {result && (
          <div className="mt-8 space-y-8">
            {/* Technical SEO */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Technical SEO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.technicalSEO && Object.entries(result.technicalSEO).map(([key, test]) => {
                  if (typeof test === 'object' && test !== null) {
                    return (
                      <div key={key} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(test.status)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                              <Badge variant="outline" className={getStatusColor(test.status)}>
                                {test.percentage}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                            {test.details && (
                              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                {test.details.title && <div>Title: {test.details.title}</div>}
                                {test.details.description && <div>Description: {test.details.description}</div>}
                                {test.details.length && <div>Length: {test.details.length} characters</div>}
                                {test.details.recommendedLength && <div>Recommended: {test.details.recommendedLength}</div>}
                                {test.details.h1Count && <div>H1 Count: {test.details.h1Count}</div>}
                                {test.details.h2Count && <div>H2 Count: {test.details.h2Count}</div>}
                                {test.details.h3Count && <div>H3 Count: {test.details.h3Count}</div>}
                                {test.details.totalImages && <div>Total Images: {test.details.totalImages}</div>}
                                {test.details.imagesWithAlt && <div>Images with Alt: {test.details.imagesWithAlt}</div>}
                                {test.details.imagesWithoutAlt && <div>Images without Alt: {test.details.imagesWithoutAlt}</div>}
                                {test.details.totalInternalLinks && <div>Internal Links: {test.details.totalInternalLinks}</div>}
                                {test.details.brokenInternalLinks && <div>Broken Links: {test.details.brokenInternalLinks}</div>}
                                {test.details.hasCanonical && <div>Has Canonical: {test.details.hasCanonical ? 'Yes' : 'No'}</div>}
                                {test.details.canonicalUrl && <div>Canonical URL: {test.details.canonicalUrl}</div>}
                                {test.details.hasSchema && <div>Has Schema: {test.details.hasSchema ? 'Yes' : 'No'}</div>}
                                {test.details.schemaTypes && test.details.schemaTypes.length > 0 && (
                                  <div>
                                    <div className="font-medium">Schema Types:</div>
                                    {test.details.schemaTypes.map((type: string, i: number) => (
                                      <div key={i} className="ml-2">• {type}</div>
                                    ))}
                                  </div>
                                )}
                                {test.details.h1Tags && test.details.h1Tags.length > 0 && (
                                  <div>
                                    <div className="font-medium">H1 Tags:</div>
                                    {test.details.h1Tags.map((tag: string, i: number) => (
                                      <div key={i} className="ml-2">• {tag}</div>
                                    ))}
                                  </div>
                                )}
                                {test.details.h2Tags && test.details.h2Tags.length > 0 && (
                                  <div>
                                    <div className="font-medium">H2 Tags:</div>
                                    {test.details.h2Tags.map((tag: string, i: number) => (
                                      <div key={i} className="ml-2">• {tag}</div>
                                    ))}
                                  </div>
                                )}
                                {test.details.missingAltImages && test.details.missingAltImages.length > 0 && (
                                  <div>
                                    <div className="font-medium">Missing Alt Images:</div>
                                    {test.details.missingAltImages.map((img: string, i: number) => (
                                      <div key={i} className="ml-2">• {img}</div>
                                    ))}
                                  </div>
                                )}
                                {test.details.internalLinkTexts && test.details.internalLinkTexts.length > 0 && (
                                  <div>
                                    <div className="font-medium">Internal Link Texts:</div>
                                    {test.details.internalLinkTexts.slice(0, 5).map((text: string, i: number) => (
                                      <div key={i} className="ml-2">• {text}</div>
                                    ))}
                                    {test.details.internalLinkTexts.length > 5 && (
                                      <div className="ml-2 text-gray-400">... and {test.details.internalLinkTexts.length - 5} more</div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                            {test.howToFix && (
                              <Button variant="destructive" size="sm" className="mt-2">
                                How to fix
                              </Button>
                            )}
                            {test.url && (
                              <a href={test.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                {test.url}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </CardContent>
            </Card>

            {/* Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="w-5 h-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.performance && Object.entries(result.performance).map(([key, test]) => {
                  if (typeof test === 'object' && test !== null) {
                    return (
                      <div key={key} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(test.status)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                              <Badge variant="outline" className={getStatusColor(test.status)}>
                                {test.percentage}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                            {test.details && (
                              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                {test.details.loadTime && <div>Load Time: {test.details.loadTime}</div>}
                                {test.details.pageSize && <div>Page Size: {test.details.pageSize}</div>}
                                {test.details.requests && <div>Requests: {test.details.requests}</div>}
                                {test.details.lcp && <div>LCP: {test.details.lcp}</div>}
                                {test.details.fid && <div>FID: {test.details.fid}</div>}
                                {test.details.cls && <div>CLS: {test.details.cls}</div>}
                                {test.details.isCompressed && <div>Compressed: {test.details.isCompressed ? 'Yes' : 'No'}</div>}
                                {test.details.compressionType && <div>Compression Type: {test.details.compressionType}</div>}
                              </div>
                            )}
                            {test.howToFix && (
                              <Button variant="destructive" size="sm" className="mt-2">
                                How to fix
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </CardContent>
            </Card>

                        {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.security && Object.entries(result.security).map(([key, test]) => {
                  if (typeof test === 'object' && test !== null) {
                    return (
                      <div key={key} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(test.status)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                              <Badge variant="outline" className={getStatusColor(test.status)}>
                                {test.percentage}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                            {test.details && (
                              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                {test.details.isHttps && <div>HTTPS: {test.details.isHttps ? 'Yes' : 'No'}</div>}
                                {test.details.sslGrade && <div>SSL Grade: {test.details.sslGrade}</div>}
                                {test.details.hasHsts && <div>HSTS: {test.details.hasHsts ? 'Yes' : 'No'}</div>}
                                {test.details.hasCsp && <div>CSP: {test.details.hasCsp ? 'Yes' : 'No'}</div>}
                                {test.details.hasXFrameOptions && <div>X-Frame-Options: {test.details.hasXFrameOptions ? 'Yes' : 'No'}</div>}
                              </div>
                            )}
                            {test.howToFix && (
                              <Button variant="destructive" size="sm" className="mt-2">
                                How to fix
                              </Button>
                            )}
                            {test.url && (
                              <a href={test.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                {test.url}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </CardContent>
            </Card>

            {/* Mobile Usability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Mobile Usability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.mobileUsability && Object.entries(result.mobileUsability).map(([key, test]) => {
                  if (typeof test === 'object' && test !== null) {
                    return (
                      <div key={key} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(test.status)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                              <Badge variant="outline" className={getStatusColor(test.status)}>
                                {test.percentage}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                            {test.details && (
                              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                {test.details.isResponsive && <div>Responsive: {test.details.isResponsive ? 'Yes' : 'No'}</div>}
                                {test.details.viewportMeta && <div>Viewport Meta: {test.details.viewportMeta ? 'Yes' : 'No'}</div>}
                                {test.details.smallTouchTargets && <div>Small Touch Targets: {test.details.smallTouchTargets}</div>}
                              </div>
                            )}
                            {test.howToFix && (
                              <Button variant="destructive" size="sm" className="mt-2">
                                How to fix
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </CardContent>
            </Card>

            {/* Content Quality */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Content Quality
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.contentQuality && Object.entries(result.contentQuality).map(([key, test]) => {
                  if (typeof test === 'object' && test !== null) {
                    return (
                      <div key={key} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(test.status)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                              <Badge variant="outline" className={getStatusColor(test.status)}>
                                {test.percentage}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                            {test.details && (
                              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                {test.details.wordCount && <div>Word Count: {test.details.wordCount}</div>}
                                {test.details.readabilityScore && <div>Readability Score: {test.details.readabilityScore}</div>}
                                {test.details.paragraphCount && <div>Paragraph Count: {test.details.paragraphCount}</div>}
                                {test.details.primaryKeywords && test.details.primaryKeywords.length > 0 && (
                                  <div>
                                    <div className="font-medium">Primary Keywords:</div>
                                    {test.details.primaryKeywords.map((keyword: string, i: number) => (
                                      <div key={i} className="ml-2">• {keyword}</div>
                                    ))}
                                  </div>
                                )}
                                {test.details.keywordDensity && <div>Keyword Density: {test.details.keywordDensity}%</div>}
                              </div>
                            )}
                            {test.howToFix && (
                              <Button variant="destructive" size="sm" className="mt-2">
                                How to fix
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </CardContent>
            </Card>

            {/* Accessibility */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.accessibility && Object.entries(result.accessibility).map(([key, test]) => {
                  if (typeof test === 'object' && test !== null) {
                    return (
                      <div key={key} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(test.status)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                              <Badge variant="outline" className={getStatusColor(test.status)}>
                                {test.percentage}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                            {test.details && (
                              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                {test.details.imagesWithAlt && <div>Images with Alt: {test.details.imagesWithAlt}</div>}
                                {test.details.imagesWithoutAlt && <div>Images without Alt: {test.details.imagesWithoutAlt}</div>}
                                {test.details.hasAriaLabels && <div>Has Aria Labels: {test.details.hasAriaLabels ? 'Yes' : 'No'}</div>}
                                {test.details.ariaLabelCount && <div>Aria Label Count: {test.details.ariaLabelCount}</div>}
                                {test.details.accessibilityScore && <div>Accessibility Score: {test.details.accessibilityScore}/100</div>}
                                {test.details.hasSkipLinks && <div>Has Skip Links: {test.details.hasSkipLinks ? 'Yes' : 'No'}</div>}
                                {test.details.navigationStructure && <div>Navigation: {test.details.navigationStructure}</div>}
                              </div>
                            )}
                            {test.howToFix && (
                              <Button variant="destructive" size="sm" className="mt-2">
                                How to fix
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </CardContent>
            </Card>

            {/* URL Structure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  URL Structure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.urlStructure && Object.entries(result.urlStructure).map(([key, test]) => {
                  if (typeof test === 'object' && test !== null) {
                    return (
                      <div key={key} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(test.status)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                              <Badge variant="outline" className={getStatusColor(test.status)}>
                                {test.percentage}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                            {test.details && (
                              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                {test.details.urlLength && <div>URL Length: {test.details.urlLength} characters</div>}
                                {test.details.hasHyphens && <div>Has Hyphens: {test.details.hasHyphens ? 'Yes' : 'No'}</div>}
                                {test.details.hasUnderscores && <div>Has Underscores: {test.details.hasUnderscores ? 'Yes' : 'No'}</div>}
                                {test.details.hasSpecialChars && <div>Has Special Characters: {test.details.hasSpecialChars ? 'Yes' : 'No'}</div>}
                              </div>
                            )}
                            {test.howToFix && (
                              <Button variant="destructive" size="sm" className="mt-2">
                                How to fix
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </CardContent>
            </Card>

            {/* Priority Actions */}
            {result.priorityActions && result.priorityActions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Priority Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.priorityActions.map((action, index) => {
                      if (typeof action === 'object' && action !== null) {
                        return (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <Badge 
                                variant={action.priority === "critical" ? "destructive" : action.priority === "high" ? "secondary" : action.priority === "medium" ? "outline" : "outline"}
                              >
                                {action.priority}
                              </Badge>
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">{action.action}</h4>
                                <div className="flex gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    Impact: {action.impact}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    Effort: {action.effort}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {action.category}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.recommendations.map((rec, index) => {
                      if (typeof rec === 'object' && rec !== null) {
                        return (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <Badge 
                                variant={rec.priority === "critical" ? "destructive" : rec.priority === "high" ? "secondary" : rec.priority === "medium" ? "outline" : "outline"}
                              >
                                {rec.priority}
                              </Badge>
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">{rec.title}</h4>
                                <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                                <p className="text-xs text-gray-500">{rec.action}</p>
                    </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                      </div>
                </CardContent>
              </Card>
                  )}

            {/* Action Buttons */}
            <div className="flex gap-2">
                    <Button variant="outline" onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}>
                      <Copy className="w-4 h-4 mr-2" />
                      {copied ? "Copied!" : "Copy Report"}
                    </Button>
                    <Button variant="outline" onClick={handleDownloadPDF}>
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              )}
      </div>
    </div>
  )
}
