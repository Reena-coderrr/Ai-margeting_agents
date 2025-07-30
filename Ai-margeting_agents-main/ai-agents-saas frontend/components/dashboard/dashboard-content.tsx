"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Zap, Calendar, Crown, BarChart2 } from "lucide-react";
import Link from "next/link";

export function DashboardContent({ activeTab, profile }: { activeTab: string, profile: any }) {
  const [usage, setUsage] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    const token = localStorage.getItem("authToken");
    
    try {
      // Fetch both usage stats and profile data
      const [usageRes, profileRes] = await Promise.all([
        fetch("http://localhost:5000/api/users/usage-stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      
      // Check if responses are ok before parsing JSON
      if (!usageRes.ok) {
        throw new Error(`Usage stats request failed: ${usageRes.status} ${usageRes.statusText}`);
      }
      if (!profileRes.ok) {
        throw new Error(`Profile request failed: ${profileRes.status} ${profileRes.statusText}`);
      }
      
      const usageData = await usageRes.json();
      const profileData = await profileRes.json();
      
      setUsage(usageData);
      
      // Update the profile data in the parent component
      if (profileData.recentActivity) {
        // Trigger a re-render by updating localStorage or using a callback
        localStorage.setItem('lastProfileUpdate', Date.now().toString());
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      // Don't update usage if there's an error, keep existing data
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshData();
    
    // Refetch on tab focus
    const handleFocus = () => refreshData();
    window.addEventListener("focus", handleFocus);
    
    // Refetch every 60 seconds to keep data fresh (reduced frequency to avoid rate limits)
    const interval = setInterval(refreshData, 60000);
    
    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, []);

  if (!profile || !usage) return <div>Loading...</div>;

  return (
    <main className="flex-1 p-6">
      <div className="mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile.firstName}!
          </h2>
          <p className="text-gray-600">Here's your AI marketing dashboard.</p>
        </div>
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

      {/* Projects Card */}
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-blue-800">Projects</CardTitle>
          <Link href="/projects" className="text-blue-600 underline text-sm font-medium">View All</Link>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6 items-center">
            <div>
              <div className="text-2xl font-bold text-blue-700">{Array.isArray(profile.projects) ? profile.projects.filter((p: any) => p.status === 'active').length : 0}</div>
              <div className="text-xs text-blue-700">Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{Array.isArray(profile.projects) ? profile.projects.filter((p: any) => p.status === 'archived').length : 0}</div>
              <div className="text-xs text-yellow-600">Archived</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700">{Array.isArray(profile.projects) ? profile.projects.filter((p: any) => p.status === 'completed').length : 0}</div>
              <div className="text-xs text-green-700">Completed</div>
            </div>
            <Link href="/projects">
              <button className="ml-8 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition">Go to Projects</button>
            </Link>
          </div>
        </CardContent>
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
            {profile.recentActivity && profile.recentActivity.length > 0 ? (
              profile.recentActivity.map((activity: any, idx: number) => (
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
