"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Zap, Calendar, Crown, BarChart2 } from "lucide-react";
import Link from "next/link";

export function DashboardContent({ activeTab }: { activeTab: string }) {
  const [profile, setProfile] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Refetch function
  const fetchData = () => {
    const token = localStorage.getItem("authToken");
    fetch("http://localhost:5000/api/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data.user);
        setRecentActivity(data.recentActivity || []);
      });
    fetch("http://localhost:5000/api/users/usage-stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUsage(data));
  };

  useEffect(() => {
    fetchData();
    // Refetch on tab focus
    const handleFocus = () => fetchData();
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  if (!profile || !usage) return <div>Loading...</div>;

  return (
    <main className="flex-1 p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {profile.firstName}!
        </h2>
        <p className="text-gray-600">Here's your AI marketing dashboard.</p>
      </div>

      {/* Plan Status */}
      <Card className="mb-6 border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-green-800">{profile.subscription?.plan} Plan Active</CardTitle>
              <span className="text-green-600">
                {profile.subscription?.plan === "free_trial"
                  ? `${profile.trialDaysRemaining} days remaining`
                  : "Active subscription"}
              </span>
            </div>
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* User Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Generations</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usage.totalGenerations}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Generations</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usage.monthlyGenerations}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.subscription?.plan}</div>
            <p className="text-xs text-muted-foreground">Current plan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trial Days Left</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.trialDaysRemaining ?? '-'}</div>
            <p className="text-xs text-muted-foreground">If on trial</p>
          </CardContent>
        </Card>
      </div>

      {/* Available Tools */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Available Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.availableTools && profile.availableTools.length > 0 ? (
              profile.availableTools.map((tool: string, idx: number) => {
                // Map tool names to correct slugs
                let toolSlug = tool.replace(/\s+/g, '-').replace(/_/g, '-').toLowerCase();
                if (toolSlug === 'social-media') toolSlug = 'social-media-content';
                // Add more mappings if needed
                return (
                  <Link key={idx} href={`/tools/${toolSlug}`} className="block">
                    <Card className="bg-green-50 border-green-200 cursor-pointer hover:shadow-md transition">
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <h4 className="font-medium text-green-900 capitalize">{tool.replace(/-/g, ' ')}</h4>
                          <p className="text-sm text-gray-600">AI-powered {tool.replace(/-/g, ' ')}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Available</Badge>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })
            ) : (
              <span>No tools available</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, idx) => (
                <li key={idx} className="mb-1">
                  <span className="font-medium">{activity.toolName}</span> - {activity.status} at {new Date(activity.createdAt).toLocaleString()}
                </li>
              ))
            ) : (
              <li>No recent activity</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
