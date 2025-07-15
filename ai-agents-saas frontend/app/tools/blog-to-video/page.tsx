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
import { ArrowLeft, Play, Download, Copy, CheckCircle, Loader2, Video, Lock, Crown, Clock, Eye, Camera, Mic } from 'lucide-react'
import { useUserStore } from "@/lib/user-store"

interface VideoScript {
  section: string
  duration: string
  script: string
  visualCues: string[]
  audioNotes: string[]
}

interface VideoResult {
  scripts: VideoScript[]
  storyboard: {
    scene: number
    timestamp: string
    visual: string
    text: string
    transition: string
  }[]
  production: {
    equipment: string[]
    locations: string[]
    props: string[]
    timeline: string
  }
  optimization: {
    title: string
    description: string
    tags: string[]
    thumbnail: string
    chapters: Array<{
      time: string
      title: string
    }>
  }
  analytics: {
    estimatedLength: string
    targetAudience: string
    engagementPrediction: string
    platformRecommendations: string[]
  }
}

export default function BlogToVideoPage() {
  const { user } = useUserStore()
  const [formData, setFormData] = useState({
    blogTitle: "",
    blogContent: "",
    videoStyle: "",
    targetPlatform: "",
    duration: "",
    audience: "",
    callToAction: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<VideoResult | null>(null)
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

    if (!formData.blogTitle || !formData.blogContent) {
      alert("Please enter blog title and content")
      return
    }

    setIsGenerating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 4500))

    // Mock comprehensive blog-to-video results
    const mockResult: VideoResult = {
      scripts: [
        {
          section: "Hook/Introduction",
          duration: "0:00 - 0:15",
          script: `Hey everyone! Have you ever wondered ${formData.blogTitle.toLowerCase()}? 

Well, I just spent weeks researching this topic, and what I discovered will completely change how you think about it.

In the next ${formData.duration || "5 minutes"}, I'm going to share the exact strategies that [specific benefit/result].

So grab a coffee, hit that subscribe button, and let's dive in!`,
          visualCues: [
            "Energetic opening with host on camera",
            "Quick montage of key points to come",
            "Subscribe button animation overlay",
            "Coffee cup or relevant prop in frame",
          ],
          audioNotes: [
            "Upbeat background music (low volume)",
            "Clear, enthusiastic delivery",
            "Slight pause after hook question",
            "Emphasize key numbers/benefits",
          ],
        },
        {
          section: "Problem/Context",
          duration: "0:15 - 1:00",
          script: `So here's the thing - most people struggle with [main problem from blog].

I see this all the time in my work with ${formData.audience || "clients"}. They're doing [common mistake] and wondering why they're not getting results.

The truth is, [key insight from blog content]. And that's exactly what we're going to fix today.

Let me show you the three main challenges everyone faces:
1. [Challenge 1]
2. [Challenge 2] 
3. [Challenge 3]

Sound familiar? Don't worry - I've got solutions for all of these.`,
          visualCues: [
            "Screen recording showing common problems",
            "Animated graphics for statistics",
            "Split screen: problem vs solution preview",
            "Numbered list animation",
          ],
          audioNotes: [
            "Slightly more serious tone",
            "Pause between each challenge",
            "Empathetic delivery for pain points",
            "Build anticipation for solutions",
          ],
        },
        {
          section: "Main Content/Solutions",
          duration: "1:00 - 4:00",
          script: `Alright, let's get into the good stuff. Here's exactly how to [main solution from blog]:

**Step 1: [First major point]**
[Detailed explanation from blog content, adapted for video]

Let me show you this in action... [demonstrate or show example]

**Step 2: [Second major point]**
This is where most people get stuck, but here's the secret: [key insight]

**Step 3: [Third major point]**
And finally, the game-changer that ties it all together...

Now, I know what you're thinking - "This sounds complicated." But trust me, once you see the results, you'll understand why this approach works so well.

Here's a real example: [case study or example from blog]`,
          visualCues: [
            "Step-by-step screen recordings",
            "Before/after comparisons",
            "Animated diagrams and flowcharts",
            "Real examples and case studies",
            "Host explaining with whiteboard/props",
          ],
          audioNotes: [
            "Clear, instructional tone",
            "Pause between major steps",
            "Emphasize key insights",
            "Use vocal variety to maintain interest",
          ],
        },
        {
          section: "Call to Action/Conclusion",
          duration: "4:00 - 5:00",
          script: `So there you have it - the complete guide to ${formData.blogTitle.toLowerCase()}.

To recap, remember these three key points:
1. [Key takeaway 1]
2. [Key takeaway 2]
3. [Key takeaway 3]

Now here's what I want you to do: ${formData.callToAction || "Try this strategy and let me know how it works for you in the comments below."}

If this video helped you out, smash that like button, subscribe for more content like this, and ring the notification bell so you never miss an update.

And hey, if you want to dive deeper into this topic, I've got a detailed blog post with even more examples - link is in the description below.

What's your biggest challenge with [topic]? Drop a comment and let me know - I read every single one and often turn them into future videos.

Thanks for watching, and I'll see you in the next one!`,
          visualCues: [
            "Host back on camera for personal connection",
            "Animated recap with key points",
            "Like/subscribe animations",
            "End screen with related videos",
            "Comment section highlight",
          ],
          audioNotes: [
            "Enthusiastic, grateful tone",
            "Clear call-to-action delivery",
            "Pause for engagement prompts",
            "Warm, personal closing",
          ],
        },
      ],
      storyboard: [
        {
          scene: 1,
          timestamp: "0:00",
          visual: "Host on camera with branded background",
          text: "Hook question overlay",
          transition: "Quick cut",
        },
        {
          scene: 2,
          timestamp: "0:05",
          visual: "Montage of key points with graphics",
          text: "Subscribe button animation",
          transition: "Smooth fade",
        },
        {
          scene: 3,
          timestamp: "0:15",
          visual: "Problem illustration/screen recording",
          text: "Statistics overlay",
          transition: "Slide transition",
        },
        {
          scene: 4,
          timestamp: "1:00",
          visual: "Step 1 demonstration",
          text: "Step counter: 1/3",
          transition: "Zoom in",
        },
        {
          scene: 5,
          timestamp: "2:00",
          visual: "Step 2 with before/after",
          text: "Step counter: 2/3",
          transition: "Wipe left",
        },
        {
          scene: 6,
          timestamp: "3:00",
          visual: "Step 3 with case study",
          text: "Step counter: 3/3",
          transition: "Fade to black",
        },
        {
          scene: 7,
          timestamp: "4:00",
          visual: "Host recap with key points",
          text: "Recap checklist animation",
          transition: "Cut to end screen",
        },
        {
          scene: 8,
          timestamp: "4:45",
          visual: "End screen with related videos",
          text: "Subscribe reminder",
          transition: "Fade out",
        },
      ],
      production: {
        equipment: [
          "DSLR camera or high-quality webcam",
          "Lavalier or shotgun microphone",
          "Ring light or softbox lighting",
          "Tripod or camera mount",
          "Green screen (optional)",
          "Screen recording software (OBS/Camtasia)",
        ],
        locations: [
          "Well-lit home office or studio",
          "Neutral background or branded backdrop",
          "Computer setup for screen recordings",
          "Quiet environment for audio recording",
        ],
        props: [
          "Branded materials (if applicable)",
          "Whiteboard or flip chart",
          "Relevant objects for demonstrations",
          "Coffee cup or personal touch items",
        ],
        timeline: "2-3 days for filming and editing",
      },
      optimization: {
        title: `${formData.blogTitle} - Complete Guide [${new Date().getFullYear()}]`,
        description: `Learn everything about ${formData.blogTitle.toLowerCase()} in this comprehensive guide. 

In this video, you'll discover:
✅ The main challenges people face with [topic]
✅ Step-by-step solutions that actually work
✅ Real examples and case studies
✅ Actionable tips you can implement today

Perfect for ${formData.audience || "anyone looking to improve their skills"}.

🔗 Full blog post with additional resources: [link]
📧 Get my free [relevant lead magnet]: [link]
💬 Join our community: [link]

Timestamps:
0:00 Introduction
0:15 The Problem
1:00 Solution Step 1
2:00 Solution Step 2  
3:00 Solution Step 3
4:00 Recap & Next Steps

#${formData.blogTitle.replace(/\s+/g, "")} #Tutorial #HowTo`,
        tags: [
          formData.blogTitle.toLowerCase(),
          "tutorial",
          "how to",
          "guide",
          "tips",
          formData.audience?.toLowerCase() || "beginners",
          "step by step",
          "2024",
        ],
        thumbnail: `Split design: Problem (left) vs Solution (right) with bold text overlay: "${formData.blogTitle}" and host photo in corner`,
        chapters: [
          { time: "0:00", title: "Introduction & Hook" },
          { time: "0:15", title: "Understanding the Problem" },
          { time: "1:00", title: "Solution Step 1" },
          { time: "2:00", title: "Solution Step 2" },
          { time: "3:00", title: "Solution Step 3" },
          { time: "4:00", title: "Recap & Call to Action" },
        ],
      },
      analytics: {
        estimatedLength: formData.duration || "5-7 minutes",
        targetAudience: formData.audience || "General audience interested in the topic",
        engagementPrediction: "High - Educational content with clear value proposition",
        platformRecommendations: [
          "YouTube (primary) - Long-form educational content",
          "LinkedIn - Professional audience",
          "Instagram Reels - Condensed version",
          "TikTok - Quick tips format",
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
              <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-pink-600 rounded-xl flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Blog to Video Script</h1>
              {hasAccess ? (
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              ) : (
                <Badge className="bg-orange-100 text-orange-800">Pro Required</Badge>
              )}
            </div>
            <p className="text-gray-600">Transform your blog posts into engaging video scripts with storyboards</p>
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
                <CardTitle>Video Setup</CardTitle>
                <CardDescription>Configure your blog-to-video conversion</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="blogTitle">Blog Title *</Label>
                  <Input
                    id="blogTitle"
                    placeholder="Enter your blog post title"
                    value={formData.blogTitle}
                    onChange={(e) => handleInputChange("blogTitle", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blogContent">Blog Content *</Label>
                  <Textarea
                    id="blogContent"
                    placeholder="Paste your blog post content here..."
                    value={formData.blogContent}
                    onChange={(e) => handleInputChange("blogContent", e.target.value)}
                    disabled={!hasAccess}
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoStyle">Video Style</Label>
                  <select
                    id="videoStyle"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={formData.videoStyle}
                    onChange={(e) => handleInputChange("videoStyle", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select video style</option>
                    <option value="talking-head">Talking Head</option>
                    <option value="screen-recording">Screen Recording</option>
                    <option value="animated">Animated Explainer</option>
                    <option value="mixed">Mixed Format</option>
                    <option value="presentation">Presentation Style</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetPlatform">Target Platform</Label>
                  <select
                    id="targetPlatform"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={formData.targetPlatform}
                    onChange={(e) => handleInputChange("targetPlatform", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select platform</option>
                    <option value="youtube">YouTube</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="facebook">Facebook</option>
                    <option value="twitter">Twitter</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Target Duration</Label>
                  <select
                    id="duration"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    disabled={!hasAccess}
                  >
                    <option value="">Select duration</option>
                    <option value="1-2 minutes">1-2 minutes (Short)</option>
                    <option value="3-5 minutes">3-5 minutes (Medium)</option>
                    <option value="5-10 minutes">5-10 minutes (Long)</option>
                    <option value="10+ minutes">10+ minutes (Deep Dive)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Input
                    id="audience"
                    placeholder="Beginners, professionals, students, etc."
                    value={formData.audience}
                    onChange={(e) => handleInputChange("audience", e.target.value)}
                    disabled={!hasAccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="callToAction">Call to Action</Label>
                  <Textarea
                    id="callToAction"
                    placeholder="What do you want viewers to do after watching?"
                    value={formData.callToAction}
                    onChange={(e) => handleInputChange("callToAction", e.target.value)}
                    disabled={!hasAccess}
                    rows={3}
                  />
                </div>

                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleGenerate}
                    disabled={!hasAccess || isGenerating || !formData.blogTitle || !formData.blogContent}
                    className="w-full bg-gradient-to-r from-red-400 to-pink-600 hover:opacity-90 text-white font-semibold py-3"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Video Script...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Generate Video Script
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
                      ? "Enter your blog content and generate a complete video script with storyboard"
                      : "Upgrade to Pro plan to access the blog-to-video tool"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Video Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-blue-500" />
                      Video Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{result.analytics.estimatedLength}</div>
                        <div className="text-sm text-gray-600">Duration</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{result.analytics.engagementPrediction.split(' - ')[0]}</div>
                        <div className="text-sm text-gray-600">Engagement</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{result.scripts.length}</div>
                        <div className="text-sm text-gray-600">Sections</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-lg font-bold text-yellow-600">{result.storyboard.length}</div>
                        <div className="text-sm text-gray-600">Scenes</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Video Script */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mic className="w-5 h-5 text-red-500" />
                      Complete Video Script
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {result.scripts.map((section, index) => (
                      <div key={index} className="border rounded-lg p-6 bg-white">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-red-100 text-red-800">
                              {section.section}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {section.duration}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(section.script, `script-${index}`)}
                          >
                            {copied[`script-${index}`] ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Script:</h4>
                            <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                                {section.script}
                              </pre>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Visual Cues:</h4>
                              <ul className="space-y-1">
                                {section.visualCues.map((cue, cueIndex) => (
                                  <li key={cueIndex} className="text-sm text-gray-600 flex items-start gap-2">
                                    <Camera className="w-4 h-4 text-blue-500 mt-0.5" />
                                    {cue}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Audio Notes:</h4>
                              <ul className="space-y-1">
                                {section.audioNotes.map((note, noteIndex) => (
                                  <li key={noteIndex} className="text-sm text-gray-600 flex items-start gap-2">
                                    <Mic className="w-4 h-4 text-green-500 mt-0.5" />
                                    {note}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Storyboard */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5 text-purple-500" />
                      Visual Storyboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.storyboard.map((scene, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 border rounded-lg bg-white">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                              <span className="text-purple-600 font-bold">{scene.scene}</span>
                            </div>
                          </div>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Timestamp</div>
                              <div className="text-sm font-medium">{scene.timestamp}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Visual</div>
                              <div className="text-sm">{scene.visual}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Text/Graphics</div>
                              <div className="text-sm">{scene.text}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Transition</div>
                              <div className="text-sm">{scene.transition}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Production Guide */}
                <Card>
                  <CardHeader>
                    <CardTitle>Production Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Equipment Needed:</h4>
                        <ul className="space-y-1">
                          {result.production.equipment.map((item, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Locations:</h4>
                        <ul className="space-y-1">
                          {result.production.locations.map((location, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-blue-500" />
                              {location}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Props & Materials:</h4>
                        <ul className="space-y-1">
                          {result.production.props.map((prop, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-purple-500" />
                              {prop}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Timeline:</h4>
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <p className="text-yellow-800 font-medium">{result.production.timeline}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* SEO Optimization */}
                <Card>
                  <CardHeader>
                    <CardTitle>Video Optimization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Optimized Title:</h4>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="font-medium">{result.optimization.title}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Description:</h4>
                      <div className="bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                          {result.optimization.description}
                        </pre>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Tags:</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.optimization.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Chapters:</h4>
                        <div className="space-y-1">
                          {result.optimization.chapters.map((chapter, index) => (
                            <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {chapter.time}
                              </Badge>
                              {chapter.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Thumbnail Concept:</h4>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-green-800 text-sm">{result.optimization.thumbnail}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Platform Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Strategy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.analytics.platformRecommendations.map((platform, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-sm">{platform}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(JSON.stringify(result, null, 2), "all-video")}
                    className="flex-1"
                  >
                    {copied["all-video"] ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copied["all-video"] ? "Copied!" : "Copy Full Script"}
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export Production Guide
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
