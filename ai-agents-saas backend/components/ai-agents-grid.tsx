"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
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
} from "lucide-react"

const aiAgents = [
  {
    id: 1,
    title: "SEO Audit Tool",
    description: "Comprehensive website SEO analysis with actionable insights and downloadable reports",
    icon: Search,
    color: "from-green-400 to-emerald-600",
    shadowColor: "shadow-green-500/50",
    category: "SEO",
  },
  {
    id: 2,
    title: "Social Media Content Generator",
    description: "Generate engaging social media posts for all platforms with scheduling capabilities",
    icon: Share2,
    color: "from-pink-400 to-rose-600",
    shadowColor: "shadow-pink-500/50",
    category: "Content",
  },
  {
    id: 3,
    title: "Blog Writing & Optimization",
    description: "AI-powered long-form content creation optimized for search engines",
    icon: PenTool,
    color: "from-blue-400 to-cyan-600",
    shadowColor: "shadow-blue-500/50",
    category: "Content",
  },
  {
    id: 4,
    title: "Email Marketing Agent",
    description: "Create compelling email campaigns and automated sequences",
    icon: Mail,
    color: "from-purple-400 to-violet-600",
    shadowColor: "shadow-purple-500/50",
    category: "Email",
  },
  {
    id: 5,
    title: "Client Reporting Agent",
    description: "Automated monthly reports with KPI analysis and visual charts",
    icon: BarChart3,
    color: "from-orange-400 to-red-600",
    shadowColor: "shadow-orange-500/50",
    category: "Analytics",
  },
  {
    id: 6,
    title: "Ad Copy Generator",
    description: "High-converting ad creatives for Google, Meta, and LinkedIn platforms",
    icon: Megaphone,
    color: "from-yellow-400 to-orange-600",
    shadowColor: "shadow-yellow-500/50",
    category: "Advertising",
  },
  {
    id: 7,
    title: "Landing Page Builder Assistant",
    description: "Auto-generate compelling landing page copy that converts",
    icon: Layout,
    color: "from-teal-400 to-green-600",
    shadowColor: "shadow-teal-500/50",
    category: "Conversion",
  },
  {
    id: 8,
    title: "Competitor Analysis Agent",
    description: "Deep competitor insights and SWOT analysis for strategic advantage",
    icon: TrendingUp,
    color: "from-indigo-400 to-purple-600",
    shadowColor: "shadow-indigo-500/50",
    category: "Research",
  },
  {
    id: 9,
    title: "Cold Outreach Personalization",
    description: "Personalized outreach messages based on prospect research",
    icon: Users,
    color: "from-rose-400 to-pink-600",
    shadowColor: "shadow-rose-500/50",
    category: "Outreach",
  },
  {
    id: 10,
    title: "Reels/Shorts Scriptwriter",
    description: "Engaging short-form video scripts with visual suggestions",
    icon: Video,
    color: "from-cyan-400 to-blue-600",
    shadowColor: "shadow-cyan-500/50",
    category: "Video",
  },
  {
    id: 11,
    title: "Product Launch Agent",
    description: "Complete launch campaign with emails, posts, and content calendar",
    icon: Rocket,
    color: "from-violet-400 to-purple-600",
    shadowColor: "shadow-violet-500/50",
    category: "Launch",
  },
  {
    id: 12,
    title: "Blog-to-Video Agent",
    description: "Convert blog content into engaging video scripts and storyboards",
    icon: Play,
    color: "from-emerald-400 to-teal-600",
    shadowColor: "shadow-emerald-500/50",
    category: "Video",
  },
  {
    id: 13,
    title: "Local SEO Booster",
    description: "Optimize local search visibility and Google Business Profile",
    icon: MapPin,
    color: "from-amber-400 to-yellow-600",
    shadowColor: "shadow-amber-500/50",
    category: "Local SEO",
  },
]

export function AIAgentsGrid() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Powerful AI Marketing Agents
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our comprehensive suite of AI-powered marketing tools designed to automate and optimize your
            digital marketing efforts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {aiAgents.map((agent) => {
            const IconComponent = agent.icon
            return (
              <Card
                key={agent.id}
                className="group relative overflow-hidden border-0 bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                style={{
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 25px 50px -12px ${agent.shadowColor.replace("shadow-", "").replace("/50", "")}`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                }}
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${agent.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="w-fit text-xs">
                    {agent.category}
                  </Badge>
                  <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 group-hover:bg-clip-text transition-all duration-300">
                    {agent.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">{agent.description}</CardDescription>
                </CardContent>

                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${agent.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                ></div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
