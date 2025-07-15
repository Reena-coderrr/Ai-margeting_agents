"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import Link from "next/link"
import {
  ArrowLeft,
  Search,
  Share2,
  PenTool,
  Mail,
  BarChart3,
  Megaphone,
  Layout,
  TrendingUp,
  Users,
  Video,
  Rocket,
  Play,
  MapPin,
  Lock,
  Crown,
  Filter,
} from "lucide-react"
import { useUserStore } from "@/lib/user-store"

const allTools = [
  {
    id: "seo-audit",
    title: "SEO Audit Tool",
    description: "Comprehensive website SEO analysis with actionable insights and downloadable reports",
    icon: Search,
    color: "from-green-400 to-emerald-600",
    shadowColor: "#34D399", // Tailwind emerald-400
    category: "SEO",
    available: true,
    plan: "Free Trial",
  },
  {
    id: "social-media",
    title: "Social Media Content Generator",
    description: "Generate engaging social media posts for all platforms with scheduling capabilities",
    icon: Share2,
    color: "from-pink-400 to-rose-600",
    shadowColor: "#F472B6", // Tailwind pink-400
    category: "Content",
    available: true,
    plan: "Free Trial",
  },
  {
    id: "blog-writing",
    title: "Blog Writing & Optimization",
    description: "AI-powered long-form content creation optimized for search engines",
    icon: PenTool,
    color: "from-blue-400 to-cyan-600",
    shadowColor: "#60A5FA", // Tailwind blue-400
    category: "Content",
    available: false,
    plan: "Pro",
  },
  {
    id: "email-marketing",
    title: "Email Marketing Agent",
    description: "Create compelling email campaigns and automated sequences",
    icon: Mail,
    color: "from-purple-400 to-violet-600",
    shadowColor: "#A78BFA", // Tailwind purple-400
    category: "Email",
    available: false,
    plan: "Pro",
  },
  {
    id: "client-reporting",
    title: "Client Reporting Agent",
    description: "Automated monthly reports with KPI analysis and visual charts",
    icon: BarChart3,
    color: "from-orange-400 to-red-600",
    shadowColor: "#FB923C", // Tailwind orange-400
    category: "Analytics",
    available: false,
    plan: "Pro",
  },
  {
    id: "ad-copy",
    title: "Ad Copy Generator",
    description: "High-converting ad creatives for Google, Meta, and LinkedIn platforms",
    icon: Megaphone,
    color: "from-yellow-400 to-orange-600",
    shadowColor: "#FACC15", // Tailwind yellow-400
    category: "Advertising",
    available: false,
    plan: "Pro",
  },
  {
    id: "landing-page",
    title: "Landing Page Builder Assistant",
    description: "Auto-generate compelling landing page copy that converts",
    icon: Layout,
    color: "from-teal-400 to-green-600",
    shadowColor: "#2DD4BF", // Tailwind teal-400
    category: "Conversion",
    available: false,
    plan: "Pro",
  },
  {
    id: "competitor-analysis",
    title: "Competitor Analysis Agent",
    description: "Deep competitor insights and SWOT analysis for strategic advantage",
    icon: TrendingUp,
    color: "from-indigo-400 to-purple-600",
    shadowColor: "#818CF8", // Tailwind indigo-400
    category: "Research",
    available: false,
    plan: "Pro",
  },
  {
    id: "cold-outreach",
    title: "Cold Outreach Personalization",
    description: "Personalized outreach messages based on prospect research",
    icon: Users,
    color: "from-rose-400 to-pink-600",
    shadowColor: "#F472B6", // Tailwind rose-400
    category: "Outreach",
    available: false,
    plan: "Pro",
  },
  {
    id: "reels-scripts",
    title: "Reels/Shorts Scriptwriter",
    description: "Engaging short-form video scripts with visual suggestions",
    icon: Video,
    color: "from-cyan-400 to-blue-600",
    shadowColor: "#22D3EE", // Tailwind cyan-400
    category: "Video",
    available: false,
    plan: "Pro",
  },
  {
    id: "product-launch",
    title: "Product Launch Agent",
    description: "Complete launch campaign with emails, posts, and content calendar",
    icon: Rocket,
    color: "from-violet-400 to-purple-600",
    shadowColor: "#A78BFA", // Tailwind violet-400
    category: "Launch",
    available: false,
    plan: "Agency",
  },
  {
    id: "blog-to-video",
    title: "Blog-to-Video Agent",
    description: "Convert blog content into engaging video scripts and storyboards",
    icon: Play,
    color: "from-emerald-400 to-teal-600",
    shadowColor: "#10B981", // Tailwind emerald-400
    category: "Video",
    available: false,
    plan: "Agency",
  },
  {
    id: "local-seo",
    title: "Local SEO Booster",
    description: "Optimize local search visibility and Google Business Profile",
    icon: MapPin,
    color: "from-amber-400 to-yellow-600",
    shadowColor: "#FBBF24", // Tailwind amber-400
    category: "Local SEO",
    available: false,
    plan: "Agency",
  },
]

const categories = [
  "All",
  "SEO",
  "Content",
  "Email",
  "Analytics",
  "Advertising",
  "Conversion",
  "Research",
  "Outreach",
  "Video",
  "Launch",
  "Local SEO",
]

export default function AllToolsPage() {
  const { user } = useUserStore()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)

  const getToolAvailability = (tool: typeof allTools[number]) => {
    if (tool.available) return true
    if (user.plan === "Free Trial") return false
    if (user.plan === "Starter") return tool.plan !== "Agency"
    return true
  }

  const filteredTools = allTools.filter((tool) => {
    const categoryMatch = selectedCategory === "All" || tool.category === selectedCategory
    const availabilityMatch = !showAvailableOnly || getToolAvailability(tool)
    return categoryMatch && availabilityMatch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All AI Marketing Tools</h1>
              <p className="text-gray-600">
                Explore all {allTools.length} powerful AI tools designed to automate your marketing workflow
              </p>
            </div>
          </div>

          {user.plan === "Free Trial" && (
            <Link href="/upgrade">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Button>
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>

          {categories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-600"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}

          <button
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              showAvailableOnly
                ? "bg-green-600 text-white"
                : "bg-white text-gray-600 hover:bg-green-50 hover:text-green-600"
            }`}
            onClick={() => setShowAvailableOnly(!showAvailableOnly)}
          >
            Available Only
          </button>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const IconComponent = tool.icon
            const isAvailable = getToolAvailability(tool)
            return (
              <Card
                key={tool.id}
                className={`group relative overflow-hidden border bg-white hover:shadow-xl transition-all duration-300 ${
                  !isAvailable ? "opacity-70" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${tool.color} flex items-center justify-center`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        isAvailable ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {isAvailable ? "Available" : tool.plan}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4">{tool.description}</CardDescription>
                  {isAvailable ? (
                    <Link href={`/tools/${tool.id}`}>
                      <Button className={`w-full bg-gradient-to-r ${tool.color} text-white`}>
                        <Play className="w-4 h-4 mr-2" />
                        Launch Tool
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/upgrade">
                      <Button variant="outline" className="w-full">
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade to Access
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
