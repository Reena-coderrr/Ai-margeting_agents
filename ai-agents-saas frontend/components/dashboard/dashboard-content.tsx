"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, Zap, Calendar, Crown, Lock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useUserStore } from "@/lib/user-store"
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface DashboardContentProps {
  activeTab: string
}

type Tool = {
  name: string;
  plans: string[];
};

export function DashboardContent({ activeTab }: DashboardContentProps) {
  const { user } = useUserStore();
  const [analytics, setAnalytics] = useState({ generations: 0, projects: 0, lastActivity: null });
  const [firstLogin, setFirstLogin] = useState(false);

  // Add a function to refresh analytics
  const refreshAnalytics = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    const res = await fetch("http://localhost:5000/api/user/analytics", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setAnalytics(await res.json());
    }
  };

  // Define all tools and which plans they belong to
  const allTools: Tool[] = [
    { name: "SEO Audit Tool", plans: ["Free Trial", "Starter", "Pro", "Agency"] },
    { name: "Social Media Generator", plans: ["Free Trial", "Starter", "Pro", "Agency"] },
    { name: "Blog Writing Agent", plans: ["Starter", "Pro", "Agency"] },
    { name: "Email Marketing Agent", plans: ["Pro", "Agency"] },
    { name: "Client Reporting", plans: ["Pro", "Agency"] },
    { name: "Ad Copy Generator", plans: ["Pro", "Agency"] },
    { name: "Landing Page Builder", plans: ["Pro", "Agency"] },
    { name: "Competitor Analysis", plans: ["Pro", "Agency"] },
    { name: "Cold Outreach", plans: ["Pro", "Agency"] },
    { name: "Reels Scripts", plans: ["Pro", "Agency"] },
    { name: "Product Launch", plans: ["Pro", "Agency"] },
    { name: "Local SEO", plans: ["Pro", "Agency"] },
    { name: "SEO Audit", plans: ["Pro", "Agency"] },
  ];
  const userTools: Tool[] = allTools.filter(tool => tool.plans.includes(user.plan));

  useEffect(() => {
    if (localStorage.getItem("firstLogin") === "true") {
      setFirstLogin(true);
      localStorage.setItem("firstLogin", "false");
    }
  }, []);

  useEffect(() => {
    async function fetchAnalytics() {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      const res = await fetch("http://localhost:5000/api/user/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setAnalytics(await res.json());
      }
    }
    fetchAnalytics();
  }, []);

  if (activeTab === "overview") {
    return (
      <main className="flex-1 p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {firstLogin ? `Welcome ${user.firstName}!` : `Welcome back, ${user.firstName}!`}
          </h2>
          <p className="text-gray-600">Here's what's happening with your AI marketing tools today.</p>
        </div>

        {/* Trial Status */}
        {user.plan === "Free Trial" && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-orange-800">Free Trial Active</CardTitle>
                  <CardDescription className="text-orange-600">
                    {(user.trialDaysLeft ?? 0)} days remaining • 2 tools available
                  </CardDescription>
                </div>
                <Link href="/upgrade">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Trial Progress</span>
                  <span>{7 - (user.trialDaysLeft ?? 0)} of 7 days used</span>
                </div>
                <Progress value={((7 - (user.trialDaysLeft ?? 0)) / 7) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription Status for Paid Plans */}
        {user.plan !== "Free Trial" && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-green-800">{user.plan} Plan Active</CardTitle>
                  <CardDescription className="text-green-600">
                    {user.plan === "Starter"
                      ? "5 tools available • 30 generations/month"
                      : user.plan === "Pro"
                        ? "All 13 tools available • 100 generations/month"
                        : "Unlimited access • All features included"}
                  </CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tools Available</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user.plan === "Free Trial" ? "2" : user.plan === "Starter" ? "5" : user.plan === "Pro" ? "13" : "13"}
              </div>
              <p className="text-xs text-muted-foreground">
                {user.plan === "Free Trial" ? "Trial access" : user.plan === "Starter" ? "Starter plan" : "Full access"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Generations</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.generations}</div>
              <p className="text-xs text-muted-foreground">Total generations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.projects}</div>
              <p className="text-xs text-muted-foreground">Active campaigns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.lastActivity ? dayjs(analytics.lastActivity).fromNow() : "-"}</div>
              <p className="text-xs text-muted-foreground">ago</p>
            </CardContent>
          </Card>
        </div>

        {/* Available Tools Section (replace both cards with a single display) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                Available Tools
              </CardTitle>
              <CardDescription>Tools included in your {user.plan.toLowerCase()} plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium">SEO Audit Tool</h4>
                  <p className="text-sm text-gray-600">Analyze website SEO performance</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Social Media Generator</h4>
                  <p className="text-sm text-gray-600">Create engaging social content</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              </div>
              {user.plan !== "Free Trial" && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Blog Writing Agent</h4>
                    <p className="text-sm text-gray-600">AI-powered content creation</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Available</Badge>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 text-orange-600" />
                </div>
                {user.plan === "Free Trial" ? "Premium Tools" : "All Tools"}
              </CardTitle>
              <CardDescription>
                {user.plan === "Free Trial" ? "Unlock with Pro or Agency plan" : "Explore all available tools"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.plan === "Free Trial" ? (
                <>
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
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Email Marketing Agent</h4>
                      <p className="text-sm text-gray-600">Automated email campaigns</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Available</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Ad Copy Generator</h4>
                      <p className="text-sm text-gray-600">High-converting ad creatives</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Available</Badge>
                  </div>
                </>
              )}
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/tools">
                  {user.plan === "Free Trial" ? "View All Premium Tools" : "View All Tools"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
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
              This tool is available in your {user.plan.toLowerCase()} plan. Start generating content now!
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">Launch Tool</Button>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-gray-600 mb-6">This tool requires a Pro or Agency subscription to access.</p>
            <Link href="/upgrade">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Access
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
