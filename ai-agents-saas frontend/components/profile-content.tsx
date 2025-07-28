import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useEffect } from "react";

export function ProfileContent({ profile }: { profile: any }) {
  if (!profile) return null;
  const [activeTab, setActiveTab] = useState("personal");
  const [subscription, setSubscription] = useState<any>(null);
  const [subLoading, setSubLoading] = useState(true);
  const [subError, setSubError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Fetch subscription info
  useEffect(() => {
    setSubLoading(true);
    fetch("http://localhost:5000/api/subscriptions/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setSubscription(data);
        setSubLoading(false);
      })
      .catch(() => {
        setSubError("Failed to load subscription info");
        setSubLoading(false);
      });
  }, []);

  // Handlers for pause/cancel
  const handlePause = async () => {
    setActionLoading(true); setActionError(""); setActionSuccess("");
    try {
      const res = await fetch("http://localhost:5000/api/subscriptions/pause", { method: "POST", credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Pause failed");
      setSubscription(data.subscription);
      setActionSuccess("Subscription paused");
    } catch (e: any) {
      setActionError(e.message);
    } finally { setActionLoading(false); }
  };
  const handleCancel = async () => {
    setActionLoading(true); setActionError(""); setActionSuccess("");
    try {
      const res = await fetch("http://localhost:5000/api/subscriptions/cancel", { method: "POST", credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Cancel failed");
      setSubscription(data.subscription);
      setActionSuccess("Subscription cancelled");
    } catch (e: any) {
      setActionError(e.message);
    } finally { setActionLoading(false); }
  };

  // Plan label and color
  const planLabel = subscription?.plan === "pro" ? "Pro" : subscription?.plan === "free_trial" ? "Free Trial" : subscription?.plan;
  const planColor = subscription?.plan === "pro" ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" : "bg-gradient-to-r from-orange-400 to-yellow-400 text-white";
  const planStatus = subscription?.status ? subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1) : "";
  const memberSince = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "-";

  return (
    <div className="py-12 px-2 min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="w-full max-w-3xl">
        <Button variant="ghost" className="mb-6 px-0 hover:bg-transparent text-blue-700 font-semibold" asChild>
          <a href="/dashboard" className="inline-flex items-center">
            &larr; Back to Dashboard
          </a>
        </Button>
        <Card className="mb-6 shadow-2xl border-0 rounded-2xl bg-white/90">
          <CardContent className="flex flex-row items-center gap-8 py-8 px-8">
            {/* Avatar on the left */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <Avatar className="w-28 h-28 shadow-lg ring-4 ring-blue-100">
                <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
                <AvatarFallback className="text-4xl bg-blue-100 text-blue-700">
                  {profile.firstName?.[0]}{profile.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            {/* Info on the right */}
            <div className="flex flex-col justify-center flex-1 min-w-0">
              <span className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1 capitalize truncate">
                {profile.firstName} {profile.lastName}
              </span>
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <Badge className={planColor + " px-3 py-1 rounded-full text-sm font-semibold shadow-md"}>{planLabel}</Badge>
                <span className="text-gray-400 text-xs whitespace-nowrap">Member since {memberSince}</span>
              </div>
              <span className="text-gray-500 text-base font-medium truncate">{profile.email}</span>
            </div>
          </CardContent>
        </Card>
        {/* Divider below the card */}
        <div className="w-full max-w-3xl mx-auto border-b border-gray-200 mb-10"></div>
        <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-100 rounded-xl shadow-sm overflow-hidden">
            <TabsTrigger value="personal" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all font-semibold py-3">Personal Info</TabsTrigger>
            <TabsTrigger value="subscription" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all font-semibold py-3">Subscription</TabsTrigger>
            <TabsTrigger value="usage" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all font-semibold py-3">Usage Stats</TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all font-semibold py-3">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="personal">
            <Card className="rounded-xl shadow-md border-0 bg-gradient-to-br from-white to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">Personal Information</CardTitle>
                <CardDescription className="text-base">Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="mb-1 text-sm text-gray-500">First Name</div>
                    <div className="font-semibold text-gray-900 text-lg">{profile.firstName}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm text-gray-500">Last Name</div>
                    <div className="font-semibold text-gray-900 text-lg">{profile.lastName}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="mb-1 text-sm text-gray-500">Email Address</div>
                    <div className="font-semibold text-gray-900 text-lg">{profile.email}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm text-gray-500">Phone</div>
                    <div className="font-semibold text-gray-900 text-lg">{profile.phone}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm text-gray-500">Company</div>
                    <div className="font-semibold text-gray-900 text-lg">{profile.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="subscription">
            <Card className="rounded-xl shadow-md border-0 bg-gradient-to-br from-white to-purple-50">
              <CardHeader>
                <CardTitle className="text-2xl">Current Plan</CardTitle>
                <CardDescription className="text-base">Manage your subscription and billing</CardDescription>
              </CardHeader>
              <CardContent>
                {subLoading ? (
                  <div className="text-center py-8">Loading subscription...</div>
                ) : subError ? (
                  <div className="text-center text-red-500 py-8">{subError}</div>
                ) : (
                  <>
                    <div className="p-6 rounded-lg bg-purple-100 flex flex-col md:flex-row items-center gap-4 mb-6">
                      <span className="font-bold text-xl text-purple-800">{planLabel}</span>
                      <span className="text-gray-700">{subscription?.plan === "free_trial" ? "Limited tools, 100 generations/month" : "All tools, unlimited generations"}</span>
                      <Badge className="bg-purple-500 text-white px-3 py-1 rounded-full">{planStatus}</Badge>
                    </div>
                    {actionError && <div className="text-red-500 mb-2">{actionError}</div>}
                    {actionSuccess && <div className="text-green-600 mb-2">{actionSuccess}</div>}
                    <div className="flex gap-3 flex-wrap">
                      <Button variant="outline" className="hover:bg-blue-50" onClick={handlePause} disabled={actionLoading || subscription?.status === "paused"}>Pause</Button>
                      <Button variant="outline" className="hover:bg-blue-50" onClick={handleCancel} disabled={actionLoading || subscription?.status === "cancelled"}>Cancel</Button>
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700" asChild>
                        <a href="/upgrade">Change Plan</a>
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="usage">
            <Card className="rounded-xl shadow-md border-0 bg-gradient-to-br from-white to-blue-50">
              <CardHeader>
                <CardTitle className="text-2xl">Usage Statistics</CardTitle>
                <CardDescription className="text-base">Track your AI tool usage and generations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-6 rounded-lg bg-blue-100 text-center shadow-sm">
                    <div className="text-4xl font-extrabold text-blue-700">{profile.usage?.totalGenerations ?? 0}</div>
                    <div className="text-gray-700 mt-1">Total Generations</div>
                  </div>
                  <div className="p-6 rounded-lg bg-green-100 text-center shadow-sm">
                    <div className="text-4xl font-extrabold text-green-700">{profile.usage?.toolsUsed?.length ?? 0}</div>
                    <div className="text-gray-700 mt-1">Tools Used</div>
                  </div>
                  <div className="p-6 rounded-lg bg-purple-100 text-center shadow-sm">
                    <div className="text-4xl font-extrabold text-purple-700">{profile.usage?.activeProjects ?? 0}</div>
                    <div className="text-gray-700 mt-1">Active Projects</div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-3 text-lg">Recent Activity</div>
                  <div className="space-y-2">
                    {profile.recentActivity && profile.recentActivity.length > 0 ? (
                      profile.recentActivity.map((activity: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
                          <div>
                            <div className="font-medium text-base">{activity.toolName}</div>
                            <div className="text-sm text-gray-600">{activity.status}</div>
                          </div>
                          <span className="text-sm text-gray-500">{new Date(activity.createdAt).toLocaleString()}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">No recent activity</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="billing">
            <Card className="rounded-xl shadow-md border-0 bg-gradient-to-br from-white to-green-50">
              <CardHeader>
                <CardTitle className="text-2xl">Billing Information</CardTitle>
                <CardDescription className="text-base">Manage your payment methods and billing history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 rounded-lg bg-green-100 mb-6">
                  <div className="font-semibold text-green-800 text-lg">Payment Method Active</div>
                  <div className="text-gray-700 text-base mt-1">•••• •••• •••• 4242 (Visa)</div>
                  <div className="text-gray-600 text-sm mt-1">Next billing: 16/8/2025</div>
                </div>
                <div className="mb-3 font-semibold text-lg">Billing History</div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
                  <div>
                    <div className="font-medium">Pro Plan</div>
                    <div className="text-sm text-gray-600">17/7/2025 - 16/8/2025</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$69.00</div>
                    <Badge className="bg-green-100 text-green-800">Paid</Badge>
                  </div>
                </div>
                <Button className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700">Update Payment Method</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 