"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import Link from "next/link"
import { ArrowLeft, Play, Download, Copy, CheckCircle, Loader2, Share2, TrendingUp, Hash } from "lucide-react"
import { useUserStore } from "@/lib/user-store"

interface SocialMediaResult {
  posts: {
    platform: string
    content: string
    hashtags: string[]
    bestTime: string
    engagement: string
  }[]
  strategy: {
    contentMix: Array<{
      type: string
      percentage: number
      description: string
    }>
    postingSchedule: Array<{
      day: string
      times: string[]
      contentType: string
    }>
    hashtagStrategy: {
      trending: string[]
      niche: string[]
      branded: string[]
    }
  }
  analytics: {
    expectedReach: string
    engagementRate: string
    bestPerformingContent: string
    growthProjection: string
  }
}

export default function SocialMediaContentPage() {
  const { user } = useUserStore()
  const [formData, setFormData] = useState({
    business: "",
    industry: "",
    targetAudience: "",
    platforms: [] as string[],
    contentGoals: "",
    brandVoice: "",
    postFrequency: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<SocialMediaResult | null>(null)
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({})

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePlatformChange = (platform: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      platforms: checked ? [...prev.platforms, platform] : prev.platforms.filter((p) => p !== platform),
    }))
  }

  const handleGenerate = async () => {
    if (!formData.business || !formData.targetAudience || formData.platforms.length === 0) {
      alert("Please fill in business name, target audience, and select at least one platform")
      return
    }

    setIsGenerating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock social media content results
    const mockResult: SocialMediaResult = {
      posts: [
        {
          platform: "Instagram",
          content: `🚀 Transform your ${formData.industry} game with these insider tips!

Swipe to see the 5 strategies that helped our clients achieve incredible results 👆

Which one resonates most with you? Drop a comment below! 👇

#${formData.industry.replace(/\s+/g, "")} #BusinessTips #Success`,
          hashtags: ["#businesstips", "#success", "#motivation", "#entrepreneur", "#growth"],
          bestTime: "Tuesday 11:00 AM",
          engagement: "High (8-12%)",
        },
        {
          platform: "LinkedIn",
          content: `The biggest mistake I see ${formData.targetAudience} make:

They focus on perfection instead of progress.

Here's what I learned after working with 100+ clients in ${formData.industry}:

→ Start before you're ready
→ Iterate based on feedback  
→ Consistency beats perfection
→ Small wins compound over time

What's holding you back from taking that first step?

#${formData.industry.replace(/\s+/g, "")} #Leadership #BusinessStrategy`,
          hashtags: ["#leadership", "#businessstrategy", "#growth", "#success"],
          bestTime: "Wednesday 9:00 AM",
          engagement: "Medium-High (6-10%)",
        },
        {
          platform: "Twitter",
          content: `Quick thread on ${formData.industry} trends for 2024 🧵

1/ The landscape is changing faster than ever
2/ ${formData.targetAudience} need to adapt or get left behind
3/ Here are the 3 key shifts I'm seeing...

(Thread continues with actionable insights)

#${formData.industry.replace(/\s+/g, "")} #Trends2024`,
          hashtags: ["#trends2024", "#business", "#innovation"],
          bestTime: "Thursday 2:00 PM",
          engagement: "Medium (4-8%)",
        },
        {
          platform: "Facebook",
          content: `🎯 CASE STUDY: How we helped [Client Name] achieve [specific result] in just 90 days

The Challenge:
Like many ${formData.targetAudience}, they were struggling with [common problem]

The Solution:
We implemented our proven 3-step framework:
✅ Step 1: [Brief description]
✅ Step 2: [Brief description]  
✅ Step 3: [Brief description]

The Results:
📈 [Specific metric] increased by X%
💰 [Revenue/savings] of $X
⏰ Saved X hours per week

Want similar results? Comment "INTERESTED" below and I'll send you our free guide!

#${formData.industry.replace(/\s+/g, "")} #CaseStudy #Results`,
          hashtags: ["#casestudy", "#results", "#success", "#business"],
          bestTime: "Friday 1:00 PM",
          engagement: "High (10-15%)",
        },
      ],
      strategy: {
        contentMix: [
          {
            type: "Educational",
            percentage: 40,
            description: "Tips, tutorials, and how-to content that provides value",
          },
          {
            type: "Behind-the-Scenes",
            percentage: 20,
            description: "Company culture, team highlights, and process insights",
          },
          {
            type: "User-Generated Content",
            percentage: 15,
            description: "Customer testimonials, reviews, and success stories",
          },
          {
            type: "Promotional",
            percentage: 15,
            description: "Product/service announcements and special offers",
          },
          {
            type: "Industry News",
            percentage: 10,
            description: "Relevant news, trends, and thought leadership",
          },
        ],
        postingSchedule: [
          {
            day: "Monday",
            times: ["9:00 AM", "3:00 PM"],
            contentType: "Motivational/Week Kickoff",
          },
          {
            day: "Tuesday",
            times: ["11:00 AM", "5:00 PM"],
            contentType: "Educational/Tips",
          },
          {
            day: "Wednesday",
            times: ["9:00 AM", "2:00 PM"],
            contentType: "Behind-the-Scenes",
          },
          {
            day: "Thursday",
            times: ["10:00 AM", "4:00 PM"],
            contentType: "Industry Insights",
          },
          {
            day: "Friday",
            times: ["1:00 PM", "6:00 PM"],
            contentType: "Case Studies/Success Stories",
          },
        ],
        hashtagStrategy: {
          trending: ["#BusinessGrowth", "#Success", "#Motivation", "#Entrepreneur"],
          niche: [`#${formData.industry.replace(/\s+/g, "")}`, "#Innovation", "#Strategy"],
          branded: [`#${formData.business.replace(/\s+/g, "")}`, "#TeamWork", "#Excellence"],
        },
      },
      analytics: {
        expectedReach: "15,000-25,000",
        engagementRate: "6-12%",
        bestPerformingContent: "Educational posts and case studies",
        growthProjection: "20-30% follower growth in 90 days",
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
              <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-600 rounded-xl flex items-center justify-center">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Social Media Content Generator</h1>
              <Badge className="bg-green-100 text-green-800">Free</Badge>
            </div>
            <p className="text-gray-600">Generate engaging social media content for all platforms</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Content Setup</CardTitle>
                <CardDescription>Configure your social media content generation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business">Business Name *</Label>
                  <Input
                    id="business"
                    placeholder="Enter your business name"
                    value={formData.business}
                    onChange={(e) => handleInputChange("business", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., Marketing, Healthcare, E-commerce"
                    value={formData.industry}
                    onChange={(e) => handleInputChange("industry", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience *</Label>
                  <Input
                    id="targetAudience"
                    placeholder="e.g., Small business owners, Young professionals"
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Platforms *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Instagram", "LinkedIn", "Twitter", "Facebook", "TikTok", "YouTube"].map((platform) => (
                      <label key={platform} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.platforms.includes(platform)}
                          onChange={(e) => handlePlatformChange(platform, e.target.checked)}
                          className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                        />
                        <span className="text-sm">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contentGoals">Content Goals</Label>
                  <Textarea
                    id="contentGoals"
                    placeholder="What do you want to achieve? (e.g., brand awareness, lead generation)"
                    value={formData.contentGoals}
                    onChange={(e) => handleInputChange("contentGoals", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brandVoice">Brand Voice</Label>
                  <select
                    id="brandVoice"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    value={formData.brandVoice}
                    onChange={(e) => handleInputChange("brandVoice", e.target.value)}
                  >
                    <option value="">Select brand voice</option>
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="casual">Casual</option>
                    <option value="authoritative">Authoritative</option>
                    <option value="playful">Playful</option>
                    <option value="inspirational">Inspirational</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postFrequency">Posting Frequency</Label>
                  <select
                    id="postFrequency"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    value={formData.postFrequency}
                    onChange={(e) => handleInputChange("postFrequency", e.target.value)}
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="5-times-week">5 times per week</option>
                    <option value="3-times-week">3 times per week</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={
                    isGenerating || !formData.business || !formData.targetAudience || formData.platforms.length === 0
                  }
                  className="w-full bg-gradient-to-r from-pink-400 to-rose-600 hover:opacity-90 text-white font-semibold py-3"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Content...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Generate Social Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {!result ? (
              <Card>
                <CardContent className="text-center py-20">
                  <Share2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Create</h3>
                  <p className="text-gray-600">
                    Fill in your business details and generate engaging social media content for all platforms
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Analytics Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Performance Projections
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{result.analytics.expectedReach}</div>
                        <div className="text-sm text-gray-600">Expected Reach</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{result.analytics.engagementRate}</div>
                        <div className="text-sm text-gray-600">Engagement Rate</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{result.analytics.growthProjection}</div>
                        <div className="text-sm text-gray-600">Growth Projection</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-sm font-bold text-yellow-600">Educational</div>
                        <div className="text-sm text-gray-600">Top Content Type</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Tabs defaultValue="posts" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="posts">Generated Posts</TabsTrigger>
                    <TabsTrigger value="strategy">Content Strategy</TabsTrigger>
                    <TabsTrigger value="hashtags">Hashtag Research</TabsTrigger>
                  </TabsList>

                  <TabsContent value="posts" className="space-y-4">
                    {result.posts.map((post, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-pink-100 text-pink-800">{post.platform}</Badge>
                              <Badge variant="outline">{post.bestTime}</Badge>
                              <Badge className="bg-green-100 text-green-800">{post.engagement}</Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(post.content, `post-${index}`)}
                            >
                              {copied[`post-${index}`] ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{post.content}</pre>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Recommended Hashtags:</p>
                              <div className="flex flex-wrap gap-1">
                                {post.hashtags.map((hashtag, hIndex) => (
                                  <Badge key={hIndex} variant="secondary" className="text-xs">
                                    {hashtag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="strategy" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Content Mix Strategy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {result.strategy.contentMix.map((mix, index) => (
                            <div key={index} className="flex items-center gap-4">
                              <div className="w-16 text-center">
                                <div className="text-2xl font-bold text-pink-600">{mix.percentage}%</div>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{mix.type}</h4>
                                <p className="text-sm text-gray-600">{mix.description}</p>
                              </div>
                              <div className="w-32">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-pink-500 h-2 rounded-full"
                                    style={{ width: `${mix.percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Optimal Posting Schedule</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {result.strategy.postingSchedule.map((schedule, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="font-medium">{schedule.day}</div>
                              <div className="flex gap-2">
                                {schedule.times.map((time, tIndex) => (
                                  <Badge key={tIndex} variant="outline" className="text-xs">
                                    {time}
                                  </Badge>
                                ))}
                              </div>
                              <div className="text-sm text-gray-600">{schedule.contentType}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="hashtags" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Hash className="w-5 h-5 text-blue-500" />
                            Trending
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {result.strategy.hashtagStrategy.trending.map((hashtag, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <Badge className="bg-blue-100 text-blue-800">{hashtag}</Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(hashtag, `trending-${index}`)}
                                >
                                  {copied[`trending-${index}`] ? (
                                    <CheckCircle className="w-3 h-3" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Hash className="w-5 h-5 text-green-500" />
                            Niche
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {result.strategy.hashtagStrategy.niche.map((hashtag, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <Badge className="bg-green-100 text-green-800">{hashtag}</Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(hashtag, `niche-${index}`)}
                                >
                                  {copied[`niche-${index}`] ? (
                                    <CheckCircle className="w-3 h-3" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Hash className="w-5 h-5 text-purple-500" />
                            Branded
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {result.strategy.hashtagStrategy.branded.map((hashtag, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <Badge className="bg-purple-100 text-purple-800">{hashtag}</Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(hashtag, `branded-${index}`)}
                                >
                                  {copied[`branded-${index}`] ? (
                                    <CheckCircle className="w-3 h-3" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(JSON.stringify(result, null, 2), "all-content")}
                    className="flex-1"
                  >
                    {copied["all-content"] ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copied["all-content"] ? "Copied!" : "Copy All Content"}
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export Content Calendar
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
