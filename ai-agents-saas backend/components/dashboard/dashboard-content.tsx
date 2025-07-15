"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, Zap, Calendar, Crown, Lock, ArrowRight } from "lucide-react"

interface DashboardContentProps {
  activeTab: string
}

export function DashboardContent({ activeTab }: DashboardContentProps) {
  if (activeTab === "overview") {
    return (
      <main className="flex-1 p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h2>
          <p className="text-gray-600">Here's what's happening with your AI marketing tools today.</p>
        </div>

        {/* Trial Status */}
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-orange-800">Free Trial Active</CardTitle>
                <CardDescription className="text-orange-600">5 days remaining • 2 tools available</CardDescription>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Trial Progress</span>
                <span>2 of 7 days used</span>
              </div>
              <Progress value={28} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tools Used</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">out of 2 available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Generations</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+3 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Active campaigns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2h</div>
              <p className="text-xs text-muted-foreground">ago</p>
            </CardContent>
          </Card>
        </div>

        {/* Available Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                Available Tools
              </CardTitle>
              <CardDescription>Tools included in your free trial</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium">SEO Audit Tool</h4>
                  <p className="text-sm text-gray-600">Analyze website SEO performance</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Free</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Social Media Generator</h4>
                  <p className="text-sm text-gray-600">Create engaging social content</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Free</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 text-orange-600" />
                </div>
                Premium Tools
              </CardTitle>
              <CardDescription>Unlock with Pro or Agency plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-75">
                <div>
                  <h4 className="font-medium">Blog Writing Agent</h4>
                  <p className="text-sm text-gray-600">AI-powered content creation</p>
                </div>
                <Badge variant="secondary">Pro</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-75">
                <div>
                  <h4 className="font-medium">Email Marketing Agent</h4>
                  <p className="text-sm text-gray-600">Automated email campaigns</p>
                </div>
                <Badge variant="secondary">Pro</Badge>
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                View All Premium Tools
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  // Tool-specific content
  return (
    <main className="flex-1 p-6">
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {activeTab === "seo-audit" && "SEO Audit Tool"}
          {activeTab === "social-media" && "Social Media Content Generator"}
          {activeTab.includes("premium") && "Premium Tool"}
        </h2>

        {activeTab === "seo-audit" || activeTab === "social-media" ? (
          <div>
            <p className="text-gray-600 mb-6">
              This tool is available in your free trial. Start generating content now!
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">Launch Tool</Button>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-gray-600 mb-6">This tool requires a Pro or Agency subscription to access.</p>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Access
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
