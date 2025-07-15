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
  Video,
  Lock,
  Crown,
  Clock,
  Eye,
  TrendingUp,
  Hash,
} from "lucide-react"
import { useUserStore } from "@/lib/user-store"

interface ReelScript {
  platform: string
  hook: string
  content: string
  cta: string
  hashtags: string[]
  duration: string
  engagement: string
}

interface ReelsResult {
  scripts: ReelScript[]
  hooks: {
    category: string
    examples: string[]
  }[]
  trends: {
    trending: string[]
    sounds: string[]
    effects: string[]
  }
  optimization: {
    bestTimes: string[]
    captionTips: string[]
    engagementTactics: string[]
  }
}

export default function ReelsScriptsPage() {
  const { user } = useUserStore()
  const [formData, setFormData] = useState({
    topic: "",
    niche: "",
    targetAudience: "",
    contentType: "",
    duration: "",
    goal: "",
    tone: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<ReelsResult | null>(null)
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

    if (!formData.topic || !formData.targetAudience) {
      alert("Please enter topic and target audience")
      return
    }

    setIsGenerating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock reels script results
    const mockResult: ReelsResult = {
      scripts: [
        {
          platform: "Instagram Reels",
          hook: `POV: You just discovered the ${formData.topic} hack that changes everything 👀`,
          content: `🎬 SCENE 1 (0-3s): Hook
"Stop scrolling! This ${formData.topic} tip will blow your mind"
[Show dramatic before/after or surprising statistic]

🎬 SCENE 2 (3-8s): Problem
"Most ${formData.targetAudience} struggle with [common problem]"
[Show relatable struggle/pain point]

🎬 SCENE 3 (8-20s): Solution
"Here's the game-changer:"
• Step 1: [Quick action]
• Step 2: [Simple technique]  
• Step 3: [Final result]
[Show each step visually]

🎬 SCENE 4 (20-25s): Proof
"This worked for [example/testimonial]"
[Show results or social proof]

🎬 SCENE 5 (25-30s): CTA
"Save this for later and follow for more ${formData.topic} tips!"`,
          cta: "Save this post and follow @youraccount for more tips!",
          hashtags: ["#" + formData.topic.replace(/\s+/g, ""), "#tips", "#viral", "#fyp", "#trending"],
          duration: "30 seconds",
          engagement: "High (12-18%)",
        },
        {
          platform: "TikTok",
          hook: `Things ${formData.targetAudience} don't know about ${formData.topic} 🤯`,
          content: `🎵 Trending Sound: [Current viral sound]

📱 VISUAL SEQUENCE:
0-2s: "Things you didn't know about ${formData.topic}"
[Text overlay with eye-catching transition]

2-8s: Fact #1
"Most people think [common misconception]"
[Show wrong way vs right way]

8-15s: Fact #2  
"But actually [surprising truth]"
[Demonstrate with quick example]

15-22s: Fact #3
"The secret ${formData.targetAudience} use is [insider tip]"
[Show advanced technique]

22-30s: Bonus Tip
"Pro tip: [extra value]"
[Quick demonstration]

30s: "Follow for more ${formData.topic} secrets!"`,
          cta: "Which tip surprised you most? Comment below! 👇",
          hashtags: ["#" + formData.topic.replace(/\s+/g, ""), "#LearnOnTikTok", "#DidYouKnow", "#fyp", "#viral"],
          duration: "30 seconds",
          engagement: "Very High (15-25%)",
        },
        {
          platform: "YouTube Shorts",
          hook: `The ${formData.topic} mistake 99% of ${formData.targetAudience} make`,
          content: `🎥 YOUTUBE SHORTS SCRIPT:

HOOK (0-3s):
"99% of ${formData.targetAudience} make this ${formData.topic} mistake"
[Bold text overlay + dramatic pause]

PROBLEM (3-10s):
"They think [common belief]"
"But this actually causes [negative outcome]"
[Show examples of the mistake]

SOLUTION (10-45s):
"Here's what you should do instead:"

Method 1: [Quick tip]
Method 2: [Better approach]  
Method 3: [Pro strategy]

[Demonstrate each method clearly]

PROOF (45-55s):
"I've helped [number] ${formData.targetAudience} with this"
"Results: [specific outcome]"
[Show testimonial or results]

CTA (55-60s):
"Subscribe for more ${formData.topic} tips that actually work!"`,
          cta: "Subscribe and hit the bell for weekly tips!",
          hashtags: ["#" + formData.topic.replace(/\s+/g, ""), "#YouTubeShorts", "#Tips", "#Tutorial"],
          duration: "60 seconds",
          engagement: "Medium-High (8-15%)",
        },
      ],
      hooks: [
        {
          category: "Question Hooks",
          examples: [
            `Are you making this ${formData.topic} mistake?`,
            `What if I told you ${formData.topic} could be easier?`,
            `Why do ${formData.targetAudience} struggle with ${formData.topic}?`,
            `Ready to transform your ${formData.topic} game?`,
          ],
        },
        {
          category: "Curiosity Hooks",
          examples: [
            `The ${formData.topic} secret nobody talks about`,
            `This ${formData.topic} hack will shock you`,
            `I wish I knew this ${formData.topic} tip sooner`,
            `The truth about ${formData.topic} that experts hide`,
          ],
        },
        {
          category: "Problem/Solution Hooks",
          examples: [
            `Stop struggling with ${formData.topic}`,
            `${formData.topic} doesn't have to be hard`,
            `The biggest ${formData.topic} myth debunked`,
            `Why your ${formData.topic} isn't working`,
          ],
        },
        {
          category: "Trending Hooks",
          examples: [
            `POV: You just mastered ${formData.topic}`,
            `Tell me you're into ${formData.topic} without telling me`,
            `Things ${formData.targetAudience} say about ${formData.topic}`,
            `${formData.topic} red flags to avoid`,
          ],
        },
      ],
      trends: {
        trending: [
          "Before/After transformations",
          "Day in the life content",
          "Behind the scenes",
          "Quick tips/hacks",
          "Myth busting",
          "Reaction videos",
        ],
        sounds: [
          "Oh No (Capone) - trending audio",
          "Original sound - motivational",
          "Aesthetic vibes - chill music",
          "Upbeat trending - energetic",
          "Voiceover trending - educational",
        ],
        effects: [
          "Green screen effect",
          "Split screen comparison",
          "Text animation",
          "Transition effects",
          "Speed ramping",
          "Color grading filters",
        ],
      },
      optimization: {
        bestTimes: ["Instagram: 6-9 AM, 12-2 PM, 5-7 PM", "TikTok: 6-10 AM, 7-9 PM", "YouTube: 2-4 PM, 8-11 PM"],
        captionTips: [
          "Start with a hook in the first line",
          "Use line breaks for easy reading",
          "Include a clear call-to-action",
          "Ask questions to boost engagement",
          "Use relevant emojis strategically",
          "Add trending hashtags (5-10 max)",
        ],
        engagementTactics: [
          "Ask viewers to comment their thoughts",
          "Create polls in your stories",
          "Use 'Save this post' CTAs",
          "Encourage shares with valuable content",
          "Respond to comments quickly",
          "Create series content for return viewers",
        ],
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
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-600 rounded-xl flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Reels/Shorts Script Writer</h1>
              {hasAccess ? (
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              ) : (
                <Badge className="bg-orange-100 text-orange-800">Pro Required</Badge>
              )}
            </div>
            <p className="text-gray-600">Create viral short-form video scripts for Instagram, TikTok & YouTube</p>
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
                <CardTitle>Script Setup</CardTitle>
                <CardDescription>Configure your short-form video script</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic/Subject *</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., productivity tips, cooking hacks, fitness"
                    value={formData.topic}
                    onChange={(e) => handleInputChange("topic", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="niche">Niche/Industry</Label>
                  <select
                    id="niche"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={formData.niche}
                    onChange={(e) => handleInputChange("niche", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select niche</option>
                    <option value="business">Business/Entrepreneurship</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="fitness">Health & Fitness</option>
                    <option value="education">Education/Learning</option>
                    <option value="technology">Technology</option>
                    <option value="food">Food & Cooking</option>
                    <option value="travel">Travel</option>
                    <option value="fashion">Fashion & Beauty</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience *</Label>
                  <Input
                    id="targetAudience"
                    placeholder="e.g., young professionals, students, parents"
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contentType">Content Type</Label>
                  <select
                    id="contentType"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={formData.contentType}
                    onChange={(e) => handleInputChange("contentType", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select content type</option>
                    <option value="educational">Educational/Tutorial</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="behind-scenes">Behind the Scenes</option>
                    <option value="before-after">Before/After</option>
                    <option value="day-in-life">Day in the Life</option>
                    <option value="tips-hacks">Tips & Hacks</option>
                    <option value="storytelling">Storytelling</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Video Duration</Label>
                  <select
                    id="duration"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select duration</option>
                    <option value="15s">15 seconds</option>
                    <option value="30s">30 seconds</option>
                    <option value="60s">60 seconds</option>
                    <option value="90s">90 seconds</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal">Content Goal</Label>
                  <select
                    id="goal"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={formData.goal}
                    onChange={(e) => handleInputChange("goal", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select goal</option>
                    <option value="viral">Go Viral</option>
                    <option value="education">Educate Audience</option>
                    <option value="engagement">Boost Engagement</option>
                    <option value="followers">Gain Followers</option>
                    <option value="brand-awareness">Brand Awareness</option>
                    <option value="sales">Drive Sales</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Content Tone</Label>
                  <select
                    id="tone"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={formData.tone}
                    onChange={(e) => handleInputChange("tone", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select tone</option>
                    <option value="energetic">Energetic</option>
                    <option value="casual">Casual</option>
                    <option value="professional">Professional</option>
                    <option value="funny">Funny/Humorous</option>
                    <option value="inspiring">Inspiring</option>
                    <option value="dramatic">Dramatic</option>
                  </select>
                </div>

                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleGenerate}
                    disabled={!hasAccess || isGenerating || !formData.topic || !formData.targetAudience}
                    className="w-full bg-gradient-to-r from-purple-400 to-pink-600 hover:opacity-90 text-white font-semibold py-3"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Scripts...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Generate Video Scripts
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
                  <Video className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Create</h3>
                  <p className="text-gray-600">
                    {hasAccess
                      ? "Enter your video details and generate viral short-form video scripts"
                      : "Upgrade to Pro plan to access the reels script writer"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Generated Scripts */}
                <div className="space-y-4">
                  {result.scripts.map((script, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-purple-100 text-purple-800">{script.platform}</Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {script.duration}
                            </Badge>
                            <Badge className="bg-green-100 text-green-800">{script.engagement}</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(script.content, `script-${index}`)}
                          >
                            {copied[`script-${index}`] ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Hook:</h4>
                            <div className="bg-yellow-50 p-3 rounded-lg">
                              <p className="font-medium text-yellow-900">{script.hook}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Full Script:</h4>
                            <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                                {script.content}
                              </pre>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Call to Action:</h4>
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-blue-800 text-sm">{script.cta}</p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Hashtags:</h4>
                              <div className="flex flex-wrap gap-1">
                                {script.hashtags.map((hashtag, hIndex) => (
                                  <Badge key={hIndex} variant="secondary" className="text-xs">
                                    {hashtag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Hook Ideas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-orange-500" />
                      Hook Ideas Library
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {result.hooks.map((hookCategory, index) => (
                        <div key={index}>
                          <h4 className="font-medium text-gray-900 mb-3">{hookCategory.category}</h4>
                          <div className="space-y-2">
                            {hookCategory.examples.map((hook, hIndex) => (
                              <div key={hIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm">{hook}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(hook, `hook-${index}-${hIndex}`)}
                                >
                                  {copied[`hook-${index}-${hIndex}`] ? (
                                    <CheckCircle className="w-3 h-3" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Trending Elements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-pink-500" />
                      Current Trends & Elements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Trending Content Types:</h4>
                        <ul className="space-y-1">
                          {result.trends.trending.map((trend, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-pink-500" />
                              {trend}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Popular Sounds:</h4>
                        <ul className="space-y-1">
                          {result.trends.sounds.map((sound, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                              <Hash className="w-4 h-4 text-blue-500" />
                              {sound}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Visual Effects:</h4>
                        <ul className="space-y-1">
                          {result.trends.effects.map((effect, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                              <Video className="w-4 h-4 text-purple-500" />
                              {effect}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Optimization Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Optimization & Best Practices
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Best Posting Times:</h4>
                      <div className="space-y-1">
                        {result.optimization.bestTimes.map((time, index) => (
                          <div key={index} className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                            {time}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Caption Tips:</h4>
                        <ul className="space-y-1">
                          {result.optimization.captionTips.map((tip, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Engagement Tactics:</h4>
                        <ul className="space-y-1">
                          {result.optimization.engagementTactics.map((tactic, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                              {tactic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(JSON.stringify(result, null, 2), "all-scripts")}
                    className="flex-1"
                  >
                    {copied["all-scripts"] ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copied["all-scripts"] ? "Copied!" : "Copy All Scripts"}
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export Script Package
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
