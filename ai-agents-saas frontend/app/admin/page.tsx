"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, DollarSign, TrendingUp, Activity, Search, Filter, MoreHorizontal, Crown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select } from "@/components/ui/select";
import { useRouter } from "next/navigation";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  plan?: string;
  status?: string;
  usage?: number;
  lastActive?: string;
};

type ToolUsage = {
  name: string;
  uses: number;
};

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ totalUsers: 0, monthlyRevenue: 0, activeSubscriptions: 0, apiUsage: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<Record<string, number>>({});
  const [analytics, setAnalytics] = useState<{ totalGenerations: number; uptime: number; avgResponseTime: number; mostPopularTools: ToolUsage[] }>({ totalGenerations: 0, uptime: 0, avgResponseTime: 0, mostPopularTools: [] });
  const [loading, setLoading] = useState(true);
  const [planFilter, setPlanFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [showPlanFilter, setShowPlanFilter] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [statsRes, usersRes, subsRes, analyticsRes] = await Promise.all([
          fetch("/api/admin/dashboard-stats"),
          fetch("/api/admin/users"),
          fetch("/api/admin/subscriptions/overview"),
          fetch("/api/admin/analytics"),
        ]);
        setStats(await statsRes.json());
        setUsers(await usersRes.json());
        setSubscriptions(await subsRes.json());
        setAnalytics(await analyticsRes.json());
      } catch (err) {
        // handle error
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      ((user.firstName + " " + user.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.company || "").toLowerCase().includes(searchTerm.toLowerCase())) &&
      (planFilter ? user.plan === planFilter : true) &&
      (statusFilter ? user.status === statusFilter : true)
  );

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Free Trial":
        return "bg-orange-100 text-orange-800"
      case "Starter":
        return "bg-blue-100 text-blue-800"
      case "Pro":
        return "bg-purple-100 text-purple-800"
      case "Agency":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage users, subscriptions, and platform analytics</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              Admin Access
            </Badge>
            <Button
              variant="outline"
              className="ml-4"
              onClick={() => {
                localStorage.removeItem("authToken");
                localStorage.removeItem("user");
                sessionStorage.clear();
                router.push("/admin/login");
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.monthlyRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+20% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Usage</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.apiUsage}K</div>
              <p className="text-xs text-muted-foreground">Generations this month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage user accounts, subscriptions, and access levels</CardDescription>
                  </div>
                  {/* Removed Add New User button */}
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Button variant="outline" onClick={() => setShowPlanFilter((v) => !v)} className="flex items-center gap-2">
                      <Filter className="w-4 h-4 mr-1" />
                      Filter
                    </Button>
                    {showPlanFilter && (
                      <div className="absolute right-0 z-20 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200 animate-fade-in">
                        {['All Plans', 'Free Trial', 'Starter', 'Pro', 'Agency'].map((plan) => (
                          <button
                            key={plan}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 focus:bg-blue-100 transition-colors ${planFilter === (plan === 'All Plans' ? '' : plan) ? 'font-bold text-blue-700' : 'text-gray-700'}`}
                            onClick={() => {
                              setPlanFilter(plan === 'All Plans' ? '' : plan);
                              setShowPlanFilter(false);
                            }}
                          >
                            {plan}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Trial">Trial</option>
                  </Select>
                  {/* Removed Filter button, filter is now live */}
                </div>

                {/* Users Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{user.company}</TableCell>
                        <TableCell>
                          <Badge className={getPlanColor(user.plan || "")}>{user.plan}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.usage} generations</TableCell>
                        <TableCell>{user.lastActive}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit User</DropdownMenuItem>
                              <DropdownMenuItem>Reset Password</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Suspend Account</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Overview</CardTitle>
                  <CardDescription>Current subscription distribution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(subscriptions).map(([plan, count]) => {
                    const total = Object.values(subscriptions).reduce((a, b) => (typeof a === 'number' && typeof b === 'number' ? a + b : 0), 0);
                    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                    const planColors: Record<string, string> = {
                      'Free Trial': 'bg-orange-100 text-orange-800',
                      'Starter': 'bg-blue-100 text-blue-800',
                      'Pro': 'bg-purple-100 text-purple-800',
                      'Agency': 'bg-green-100 text-green-800',
                    };
                    const bgColors: Record<string, string> = {
                      'Free Trial': 'bg-orange-50',
                      'Starter': 'bg-blue-50',
                      'Pro': 'bg-purple-50',
                      'Agency': 'bg-green-50',
                    };
                    return (
                      <div key={plan} className={`flex items-center justify-between p-3 rounded-lg ${bgColors[plan] || 'bg-gray-50'}`}>
                        <div>
                          <h4 className="font-medium">{plan} Plan</h4>
                          <p className="text-sm text-gray-600">{count} users</p>
                        </div>
                        <Badge className={planColors[plan] || 'bg-gray-100 text-gray-800'}>{percent}%</Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Metrics</CardTitle>
                  <CardDescription>Monthly recurring revenue breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">${stats.monthlyRevenue.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">Total MRR</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold">${0.00}</div>
                      <div className="text-xs text-gray-600">Starter</div>
                    </div>

                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold">${0.00}</div>
                      <div className="text-xs text-gray-600">Pro</div>
                    </div>

                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold">${0.00}</div>
                      <div className="text-xs text-gray-600">Agency</div>
                    </div>

                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold">+20%</div>
                      <div className="text-xs text-gray-600">Growth</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                  <CardDescription>Usage statistics and performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{stats.apiUsage}K</div>
                      <div className="text-sm text-gray-600">Total Generations</div>
                      <div className="text-xs text-green-600 mt-1">+15% this month</div>
                    </div>

                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{analytics.uptime}%</div>
                      <div className="text-sm text-gray-600">Uptime</div>
                      <div className="text-xs text-green-600 mt-1">Last 30 days</div>
                    </div>

                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">{analytics.avgResponseTime}s</div>
                      <div className="text-sm text-gray-600">Avg Response Time</div>
                      <div className="text-xs text-green-600 mt-1">-0.2s improvement</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Most Popular Tools</CardTitle>
                  <CardDescription>Usage statistics by AI tool</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.mostPopularTools && analytics.mostPopularTools.length > 0 && (
                      (() => {
                        const maxUses = Math.max(...analytics.mostPopularTools.map((tool: ToolUsage) => tool.uses));
                        return analytics.mostPopularTools.map((tool: ToolUsage) => (
                          <div key={tool.name} className="flex items-center justify-between">
                            <span>{tool.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{ width: `${maxUses ? (tool.uses / maxUses) * 100 : 0}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">{tool.uses} uses</span>
                            </div>
                          </div>
                        ));
                      })()
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure platform-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-12">
                  <Crown className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Settings</h3>
                  <p className="text-gray-600">Platform configuration options will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
