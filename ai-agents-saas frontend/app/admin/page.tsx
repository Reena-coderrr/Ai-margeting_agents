"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, DollarSign, TrendingUp, Activity, Search, Filter, MoreHorizontal, Crown, Eye, Edit, Ban, CheckCircle, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  isSuspended?: boolean;
  subscription?: {
    plan: string;
    status: string;
    trialStartDate?: string;
    trialEndDate?: string;
    subscriptionStartDate?: string;
    subscriptionEndDate?: string;
  };
  usage?: {
    totalGenerations: number;
    monthlyGenerations: number;
    lastResetDate: string;
    toolsUsed: Array<{
      toolId: string;
      toolName: string;
      usageCount: number;
      lastUsed: string;
    }>;
  };
  lastLogin?: string;
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
  const { toast } = useToast();
  const [settings, setSettings] = useState<any>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  
  // User management states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showViewDetails, setShowViewDetails] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showSuspendAccount, setShowSuspendAccount] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [editUserData, setEditUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    plan: "",
    status: ""
  });
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [statsRes, usersRes, subsRes, analyticsRes] = await Promise.all([
          fetch("http://localhost:5000/api/admin/dashboard-stats"),
          fetch("http://localhost:5000/api/admin/users"),
          fetch("http://localhost:5000/api/admin/subscriptions/overview"),
          fetch("http://localhost:5000/api/admin/analytics"),
        ]);
        setStats(await statsRes.json());
        setUsers(await usersRes.json());
        setSubscriptions(await subsRes.json());
        setAnalytics(await analyticsRes.json());
      } catch (err) {
        console.error("Error fetching admin data:", err);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Fetch settings when Settings tab is opened
  useEffect(() => {
    async function fetchSettings() {
      setSettingsLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/admin/settings");
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        toast({ title: "Error", description: "Failed to load settings", variant: "destructive" });
      }
      setSettingsLoading(false);
    }
    // Only fetch if not already loaded
    if (!settings) fetchSettings();
  }, [settings, toast]);

  // Handler for updating settings fields
  function updateSetting(path: string, value: any) {
    setSettings((prev: any) => {
      if (!prev) return prev;
      const newSettings = { ...prev };
      // Support dot notation for nested fields
      const keys = path.split(".");
      let obj = newSettings;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return newSettings;
    });
  }

  async function saveSettings() {
    setSettingsSaving(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      const data = await res.json();
      setSettings(data);
      toast({ title: "Settings saved", description: "Settings updated successfully." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    }
    setSettingsSaving(false);
  }

  const filteredUsers = users.filter(
    (user) =>
      ((user.firstName + " " + user.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.company || "").toLowerCase().includes(searchTerm.toLowerCase())) &&
      (planFilter ? user.subscription?.plan === planFilter : true) &&
      (statusFilter ? user.subscription?.status === statusFilter : true)
  );

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "free_trial":
        return "bg-orange-100 text-orange-800"
      case "starter":
        return "bg-blue-100 text-blue-800"
      case "pro":
        return "bg-purple-100 text-purple-800"
      case "agency":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  function getLastActive(user: User) {
    if (user.lastActive) {
      return new Date(user.lastActive).toLocaleString();
    }
    if (user.lastLogin) {
      return new Date(user.lastLogin).toLocaleString();
    }
    return "Never";
  }

  // User management functions
  const handleViewDetails = async (user: User) => {
    setSelectedUser(user);
    setShowViewDetails(true);
  };

  const handleEditUser = (user: User) => {
    console.log('Editing user:', user);
    setSelectedUser(user);
    setEditUserData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      company: user.company || "",
      plan: user.subscription?.plan || "",
      status: user.subscription?.status || ""
    });
    setShowEditUser(true);
  };

  const handleCloseEditModal = () => {
    setShowEditUser(false);
    setEditUserData({
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      plan: "",
      status: ""
    });
  };

  const handleSuspendAccount = async (user: User) => {
    setSelectedUser(user);
    setShowSuspendAccount(true);
  };

  const handleDeleteAccount = async (user: User) => {
    setSelectedUser(user);
    setShowDeleteAccount(true);
  };

  const confirmSuspendAccount = async () => {
    if (!selectedUser) return;
    
    setLoadingAction(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${selectedUser._id}/toggle-suspension`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        toast({ title: "Success", description: result.message });
        setShowSuspendAccount(false);
        // Refresh users list
        const usersRes = await fetch("http://localhost:5000/api/admin/users");
        const updatedUsers = await usersRes.json();
        setUsers(updatedUsers);
      } else {
        const error = await response.json();
        console.error('Suspend account error:', error);
        toast({ title: "Error", description: error.message || "Failed to update account status", variant: "destructive" });
      }
    } catch (error) {
      console.error('Suspend account error:', error);
      toast({ title: "Error", description: "Failed to update account status", variant: "destructive" });
    } finally {
      setLoadingAction(false);
    }
  };

  const confirmDeleteAccount = async () => {
    if (!selectedUser) return;

    setLoadingAction(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${selectedUser._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        toast({ title: "Success", description: result.message });
        setShowDeleteAccount(false);
        // Refresh users list
        const usersRes = await fetch("http://localhost:5000/api/admin/users");
        const updatedUsers = await usersRes.json();
        setUsers(updatedUsers);
      } else {
        const error = await response.json();
        console.error('Delete account error:', error);
        toast({ title: "Error", description: error.message || "Failed to delete account", variant: "destructive" });
      }
    } catch (error) {
      console.error('Delete account error:', error);
      toast({ title: "Error", description: "Failed to delete account", variant: "destructive" });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleSaveEditUser = async () => {
    if (!selectedUser) return;
    
    // Validate required fields
    if (!editUserData.firstName || !editUserData.lastName || !editUserData.email) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    
    setLoadingAction(true);
    try {
      console.log('Sending edit data:', editUserData);
      
      const response = await fetch(`http://localhost:5000/api/admin/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          firstName: editUserData.firstName,
          lastName: editUserData.lastName,
          email: editUserData.email,
          company: editUserData.company,
          subscription: {
            plan: editUserData.plan,
            status: editUserData.status
          }
        })
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Update result:', result);
        toast({ title: "Success", description: "User updated successfully" });
        handleCloseEditModal();
        
        // Refresh users list
        const usersRes = await fetch("http://localhost:5000/api/admin/users");
        const updatedUsers = await usersRes.json();
        setUsers(updatedUsers);
        
      } else {
        const error = await response.json();
        console.error('Update error:', error);
        toast({ title: "Error", description: error.message || "Failed to update user", variant: "destructive" });
      }
    } catch (error) {
      console.error('Update error:', error);
      toast({ title: "Error", description: "Failed to update user", variant: "destructive" });
    } finally {
      setLoadingAction(false);
    }
  };

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
                    <Button 
                      variant="outline" 
                      onClick={() => setShowPlanFilter((v) => !v)} 
                      className={`flex items-center gap-2 ${planFilter ? 'border-blue-500 bg-blue-50' : ''}`}
                    >
                      <Filter className="w-4 h-4 mr-1" />
                      Filter
                      {planFilter && (
                        <Badge variant="secondary" className="ml-1 text-xs bg-blue-100 text-blue-800">
                          {planFilter === 'free_trial' ? 'Free Trial' : 
                           planFilter === 'starter' ? 'Starter' : 
                           planFilter === 'pro' ? 'Pro' : 
                           planFilter === 'agency' ? 'Agency' : planFilter}
                        </Badge>
                      )}
                    </Button>
                    {showPlanFilter && (
                      <div className="absolute right-0 z-20 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200 animate-fade-in">
                        {[
                          { value: '', label: 'All Plans' },
                          { value: 'free_trial', label: 'Free Trial' },
                          { value: 'starter', label: 'Starter' },
                          { value: 'pro', label: 'Pro' },
                          { value: 'agency', label: 'Agency' }
                        ].map((plan) => (
                          <button
                            key={plan.value}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 focus:bg-blue-100 transition-colors ${planFilter === plan.value ? 'font-bold text-blue-700' : 'text-gray-700'}`}
                            onClick={() => {
                              setPlanFilter(plan.value);
                              setShowPlanFilter(false);
                            }}
                          >
                            {plan.label}
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
                            {user.isSuspended && (
                              <Badge variant="destructive" className="mt-1 text-xs">Suspended</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{user.company}</TableCell>
                        <TableCell>
                          <Badge className={getPlanColor(user.subscription?.plan || "")}>{user.subscription?.plan || "No Plan"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {user.subscription?.status || "Unknown"}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.usage?.totalGenerations || 0} generations</TableCell>
                        <TableCell>{getLastActive(user)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleSuspendAccount(user)}
                                className="text-red-600"
                                disabled={loadingAction}
                              >
                                <Ban className="w-4 h-4 mr-2" />
                                {loadingAction ? "Processing..." : (user.isSuspended ? "Activate Account" : "Suspend Account")}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteAccount(user)}
                                className="text-red-600"
                                disabled={loadingAction}
                              >
                                <X className="w-4 h-4 mr-2" />
                                {loadingAction ? "Processing..." : "Delete Account"}
                              </DropdownMenuItem>
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
                  {Object.entries(subscriptions).map(([plan, count]: [string, any]) => {
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
                <Accordion type="multiple" className="w-full">
                  {/* 1. Platform Configuration */}
                  <AccordionItem value="platform-config">
                    <AccordionTrigger>Platform Configuration</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {/* System Settings */}
                        <div>
                          <h4 className="font-semibold">System Settings</h4>
                          <div className="flex flex-col gap-2 max-w-md">
                            <label className="text-sm font-medium">DB Connection</label>
                            <input
                              className="border rounded px-2 py-1"
                              type="text"
                              value={settings?.platform?.dbConnection || ""}
                              onChange={e => updateSetting("platform.dbConnection", e.target.value)}
                              disabled={settingsLoading}
                            />
                            <label className="text-sm font-medium mt-2">API Keys</label>
                            {(settings?.platform?.apiKeys || []).map((key: string, idx: number) => (
                              <div key={idx} className="flex gap-2 items-center">
                                <input
                                  className="border rounded px-2 py-1 flex-1"
                                  type="text"
                                  value={key}
                                  onChange={e => {
                                    const newKeys = [...settings.platform.apiKeys];
                                    newKeys[idx] = e.target.value;
                                    updateSetting("platform.apiKeys", newKeys);
                                  }}
                                  disabled={settingsLoading}
                                />
                                <Button size="sm" variant="destructive" onClick={() => {
                                  const newKeys = settings.platform.apiKeys.filter((_: any, i: number) => i !== idx);
                                  updateSetting("platform.apiKeys", newKeys);
                                }}>Remove</Button>
                              </div>
                            ))}
                            <Button size="sm" onClick={() => updateSetting("platform.apiKeys", [...(settings?.platform?.apiKeys || []), ""])}>Add API Key</Button>
                            <label className="text-sm font-medium mt-2">Environment Variables</label>
                            {settings?.platform?.envVars && Object.entries(settings.platform.envVars).map(([k, v]: [string, string], idx: number) => (
                              <div key={k} className="flex gap-2 items-center">
                                <input
                                  className="border rounded px-2 py-1 flex-1"
                                  type="text"
                                  value={k}
                                  onChange={e => {
                                    const newVars = { ...settings.platform.envVars };
                                    const val = newVars[k];
                                    delete newVars[k];
                                    newVars[e.target.value] = val;
                                    updateSetting("platform.envVars", newVars);
                                  }}
                                  disabled={settingsLoading}
                                />
                                <input
                                  className="border rounded px-2 py-1 flex-1"
                                  type="text"
                                  value={v}
                                  onChange={e => {
                                    const newVars = { ...settings.platform.envVars };
                                    newVars[k] = e.target.value;
                                    updateSetting("platform.envVars", newVars);
                                  }}
                                  disabled={settingsLoading}
                                />
                                <Button size="sm" variant="destructive" onClick={() => {
                                  const newVars = { ...settings.platform.envVars };
                                  delete newVars[k];
                                  updateSetting("platform.envVars", newVars);
                                }}>Remove</Button>
                              </div>
                            ))}
                            <Button size="sm" onClick={() => updateSetting("platform.envVars", { ...settings.platform.envVars, "": "" })}>Add Env Var</Button>
                          </div>
                        </div>
                        {/* Payment Settings */}
                        <div>
                          <h4 className="font-semibold">Payment Settings</h4>
                          <div className="flex flex-col gap-2 max-w-md">
                            <label className="text-sm font-medium">Stripe Key</label>
                            <input
                              className="border rounded px-2 py-1"
                              type="text"
                              value={settings?.platform?.payment?.stripe || ""}
                              onChange={e => updateSetting("platform.payment.stripe", e.target.value)}
                              disabled={settingsLoading}
                            />
                            <label className="text-sm font-medium mt-2">Subscription Plans</label>
                            {(settings?.platform?.payment?.plans || []).map((plan: any, idx: number) => (
                              <div key={idx} className="border p-2 rounded mb-2">
                                <input
                                  className="border rounded px-2 py-1 mb-1"
                                  type="text"
                                  value={plan.name}
                                  placeholder="Plan Name"
                                  onChange={e => {
                                    const newPlans = [...settings.platform.payment.plans];
                                    newPlans[idx].name = e.target.value;
                                    updateSetting("platform.payment.plans", newPlans);
                                  }}
                                  disabled={settingsLoading}
                                />
                                <input
                                  className="border rounded px-2 py-1 mb-1"
                                  type="number"
                                  value={plan.price}
                                  placeholder="Price"
                                  onChange={e => {
                                    const newPlans = [...settings.platform.payment.plans];
                                    newPlans[idx].price = Number(e.target.value);
                                    updateSetting("platform.payment.plans", newPlans);
                                  }}
                                  disabled={settingsLoading}
                                />
                                <div className="flex flex-wrap gap-2 mb-1">
                                  {(settings?.aiTools?.enabledTools || []).map((tool: string) => (
                                    <label key={tool} className="flex items-center gap-1">
                                      <input
                                        type="checkbox"
                                        checked={plan.features?.includes(tool)}
                                        onChange={e => {
                                          const newPlans = [...settings.platform.payment.plans];
                                          if (e.target.checked) {
                                            newPlans[idx].features = [...(plan.features || []), tool];
                                          } else {
                                            newPlans[idx].features = (plan.features || []).filter((f: string) => f !== tool);
                                          }
                                          updateSetting("platform.payment.plans", newPlans);
                                        }}
                                        disabled={settingsLoading}
                                      />
                                      {tool}
                                    </label>
                                  ))}
                                </div>
                                <Button size="sm" variant="destructive" onClick={() => {
                                  const newPlans = settings.platform.payment.plans.filter((_: any, i: number) => i !== idx);
                                  updateSetting("platform.payment.plans", newPlans);
                                }}>Remove Plan</Button>
                              </div>
                            ))}
                            <Button size="sm" onClick={() => updateSetting("platform.payment.plans", [...(settings?.platform?.payment?.plans || []), { name: "", price: 0, features: [] }])}>Add Plan</Button>
                          </div>
                        </div>
                        {/* Security Settings */}
                        <div>
                          <h4 className="font-semibold">Security Settings</h4>
                          <div className="flex flex-col gap-2 max-w-md">
                            <label className="text-sm font-medium">Password Min Length</label>
                            <input
                              className="border rounded px-2 py-1"
                              type="number"
                              value={settings?.platform?.security?.passwordPolicy?.minLength || 8}
                              onChange={e => updateSetting("platform.security.passwordPolicy.minLength", Number(e.target.value))}
                              disabled={settingsLoading}
                            />
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={!!settings?.platform?.security?.passwordPolicy?.requireNumbers}
                                onChange={e => updateSetting("platform.security.passwordPolicy.requireNumbers", e.target.checked)}
                                disabled={settingsLoading}
                              />
                              Require Numbers
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={!!settings?.platform?.security?.passwordPolicy?.requireSpecial}
                                onChange={e => updateSetting("platform.security.passwordPolicy.requireSpecial", e.target.checked)}
                                disabled={settingsLoading}
                              />
                              Require Special Characters
                            </label>
                            <label className="text-sm font-medium">Session Timeout (minutes)</label>
                            <input
                              className="border rounded px-2 py-1"
                              type="number"
                              value={settings?.platform?.security?.sessionTimeout || 30}
                              onChange={e => updateSetting("platform.security.sessionTimeout", Number(e.target.value))}
                              disabled={settingsLoading}
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  {/* 2. User Management Settings */}
                  <AccordionItem value="user-management">
                    <AccordionTrigger>User Management Settings</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {/* Registration Settings */}
                        <div>
                          <h4 className="font-semibold">Registration Settings</h4>
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Enable Registration</label>
                            <input
                              type="checkbox"
                              checked={!!settings?.userManagement?.registrationEnabled}
                              onChange={e => updateSetting("userManagement.registrationEnabled", e.target.checked)}
                              disabled={settingsLoading}
                            />
                          </div>
                        </div>
                        {/* Trial Settings */}
                        <div>
                          <h4 className="font-semibold">Trial Settings</h4>
                          <div className="flex flex-col gap-2 max-w-md">
                            <label className="text-sm font-medium">Default Trial Duration (days)</label>
                            <input
                              className="border rounded px-2 py-1"
                              type="number"
                              value={settings?.userManagement?.trial?.durationDays || 7}
                              onChange={e => updateSetting("userManagement.trial.durationDays", Number(e.target.value))}
                              disabled={settingsLoading}
                            />
                            <label className="text-sm font-medium">Trial Usage Limit</label>
                            <input
                              className="border rounded px-2 py-1"
                              type="number"
                              value={settings?.userManagement?.trial?.usageLimit || 100}
                              onChange={e => updateSetting("userManagement.trial.usageLimit", Number(e.target.value))}
                              disabled={settingsLoading}
                            />
                          </div>
                        </div>
                        {/* Plan Settings */}
                        <div>
                          <h4 className="font-semibold">Plan Settings</h4>
                          <div className="flex flex-col gap-2 max-w-md">
                            {(settings?.userManagement?.plans || []).map((plan: any, idx: number) => (
                              <div key={idx} className="border p-2 rounded mb-2">
                                <input
                                  className="border rounded px-2 py-1 mb-1"
                                  type="text"
                                  value={plan.name}
                                  placeholder="Plan Name"
                                  onChange={e => {
                                    const newPlans = [...settings.userManagement.plans];
                                    newPlans[idx].name = e.target.value;
                                    updateSetting("userManagement.plans", newPlans);
                                  }}
                                  disabled={settingsLoading}
                                />
                                <input
                                  className="border rounded px-2 py-1 mb-1"
                                  type="number"
                                  value={plan.price}
                                  placeholder="Price"
                                  onChange={e => {
                                    const newPlans = [...settings.userManagement.plans];
                                    newPlans[idx].price = Number(e.target.value);
                                    updateSetting("userManagement.plans", newPlans);
                                  }}
                                  disabled={settingsLoading}
                                />
                                <div className="flex flex-wrap gap-2 mb-1">
                                  {(settings?.aiTools?.enabledTools || []).map((tool: string) => (
                                    <label key={tool} className="flex items-center gap-1">
                                      <input
                                        type="checkbox"
                                        checked={plan.features?.includes(tool)}
                                        onChange={e => {
                                          const newPlans = [...settings.userManagement.plans];
                                          if (e.target.checked) {
                                            newPlans[idx].features = [...(plan.features || []), tool];
                                          } else {
                                            newPlans[idx].features = (plan.features || []).filter((f: string) => f !== tool);
                                          }
                                          updateSetting("userManagement.plans", newPlans);
                                        }}
                                        disabled={settingsLoading}
                                      />
                                      {tool}
                                    </label>
                                  ))}
                                </div>
                                <Button size="sm" variant="destructive" onClick={() => {
                                  const newPlans = settings.userManagement.plans.filter((_: any, i: number) => i !== idx);
                                  updateSetting("userManagement.plans", newPlans);
                                }}>Remove Plan</Button>
                              </div>
                            ))}
                            <Button size="sm" onClick={() => updateSetting("userManagement.plans", [...(settings?.userManagement?.plans || []), { name: "", price: 0, features: [] }])}>Add Plan</Button>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  {/* 3. AI Tool Settings */}
                  <AccordionItem value="ai-tool-settings">
                    <AccordionTrigger>AI Tool Settings</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {/* Usage Limits */}
                        <div>
                          <h4 className="font-semibold">Usage Limits</h4>
                          <div className="flex flex-col gap-2 max-w-md">
                            {Object.entries(settings?.aiTools?.usageLimits || {}).map(([plan, limit]: [string, any]) => (
                              <div key={plan} className="flex items-center gap-2">
                                <label className="text-sm font-medium capitalize">{plan.replace("_", " ")}</label>
                                <input
                                  className="border rounded px-2 py-1"
                                  type="number"
                                  value={limit}
                                  onChange={e => {
                                    const newLimits = { ...settings.aiTools.usageLimits, [plan]: Number(e.target.value) };
                                    updateSetting("aiTools.usageLimits", newLimits);
                                  }}
                                  disabled={settingsLoading}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Tool Configuration */}
                        <div>
                          <h4 className="font-semibold">Tool Configuration</h4>
                          <div className="flex flex-wrap gap-2">
                            {(settings?.aiTools?.enabledTools || []).map((tool: string, idx: number) => (
                              <label key={tool} className="flex items-center gap-1">
                                <input
                                  type="checkbox"
                                  checked={settings.aiTools.enabledTools.includes(tool)}
                                  onChange={e => {
                                    let newTools = [...settings.aiTools.enabledTools];
                                    if (e.target.checked) {
                                      if (!newTools.includes(tool)) newTools.push(tool);
                                    } else {
                                      newTools = newTools.filter((t: string) => t !== tool);
                                    }
                                    updateSetting("aiTools.enabledTools", newTools);
                                  }}
                                  disabled={settingsLoading}
                                />
                                {tool}
                                <Button size="sm" variant="destructive" onClick={() => {
                                  const newTools = settings.aiTools.enabledTools.filter((_: string, i: number) => i !== idx);
                                  updateSetting("aiTools.enabledTools", newTools);
                                }}>Remove</Button>
                              </label>
                            ))}
                            <Button size="sm" onClick={() => updateSetting("aiTools.enabledTools", [...(settings?.aiTools?.enabledTools || []), ""])}>Add Tool</Button>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="flex justify-end mt-6">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    onClick={saveSettings}
                    disabled={settingsLoading || settingsSaving}
                  >
                    {settingsSaving ? "Saving..." : "Save Settings"}
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* User Management Modals */}
        
        {/* View Details Modal */}
        <Dialog open={showViewDetails} onOpenChange={setShowViewDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>Detailed information about the selected user</DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <p className="text-sm text-gray-600">{selectedUser.firstName} {selectedUser.lastName}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm text-gray-600">{selectedUser.email}</p>
                  </div>
                  <div>
                    <Label>Company</Label>
                    <p className="text-sm text-gray-600">{selectedUser.company || "N/A"}</p>
                  </div>
                  <div>
                    <Label>Plan</Label>
                    <Badge className={getPlanColor(selectedUser.subscription?.plan || "")}>
                      {selectedUser.subscription?.plan || "No Plan"}
                    </Badge>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {selectedUser.subscription?.status || "Unknown"}
                    </Badge>
                  </div>
                  <div>
                    <Label>Total Generations</Label>
                    <p className="text-sm text-gray-600">{selectedUser.usage?.totalGenerations || 0}</p>
                  </div>
                  <div>
                    <Label>Last Active</Label>
                    <p className="text-sm text-gray-600">{getLastActive(selectedUser)}</p>
                  </div>
                </div>
                
                {selectedUser.usage?.toolsUsed && selectedUser.usage.toolsUsed.length > 0 && (
                  <div>
                    <Label>Tools Used</Label>
                    <div className="space-y-2">
                      {selectedUser.usage.toolsUsed.map((tool, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{tool.toolName}</span>
                          <span>{tool.usageCount} uses</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setShowViewDetails(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Modal */}
        <Dialog open={showEditUser} onOpenChange={(open) => {
          if (!open) {
            handleCloseEditModal();
          }
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user information and subscription details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={editUserData.firstName}
                    onChange={(e) => setEditUserData({...editUserData, firstName: e.target.value})}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={editUserData.lastName}
                    onChange={(e) => setEditUserData({...editUserData, lastName: e.target.value})}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={editUserData.email}
                  onChange={(e) => setEditUserData({...editUserData, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={editUserData.company}
                  onChange={(e) => setEditUserData({...editUserData, company: e.target.value})}
                  placeholder="Enter company name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plan">Plan</Label>
                  <Select value={editUserData.plan} onValueChange={(value) => setEditUserData({...editUserData, plan: value})}>
                    <option value="">Select Plan</option>
                    <option value="free_trial">Free Trial</option>
                    <option value="starter">Starter</option>
                    <option value="pro">Pro</option>
                    <option value="agency">Agency</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={editUserData.status} onValueChange={(value) => setEditUserData({...editUserData, status: value})}>
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="trial">Trial</option>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseEditModal}>Cancel</Button>
              <Button onClick={handleSaveEditUser} disabled={loadingAction}>
                {loadingAction ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Suspend Account Confirmation Modal */}
        <Dialog open={showSuspendAccount} onOpenChange={setShowSuspendAccount}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Account Action</DialogTitle>
              <DialogDescription>
                {selectedUser?.isSuspended 
                  ? "Are you sure you want to activate this user account?" 
                  : "Are you sure you want to suspend this user account? This will prevent them from accessing the platform."
                }
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Ban className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">{selectedUser.email}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSuspendAccount(false)}>Cancel</Button>
              <Button 
                variant="destructive" 
                onClick={confirmSuspendAccount}
                disabled={loadingAction}
              >
                {loadingAction ? "Processing..." : (selectedUser?.isSuspended ? "Activate Account" : "Suspend Account")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Account Confirmation Modal */}
        <Dialog open={showDeleteAccount} onOpenChange={setShowDeleteAccount}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Account Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user account? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <X className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-800">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">{selectedUser.email}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteAccount(false)}>Cancel</Button>
              <Button 
                variant="destructive" 
                onClick={confirmDeleteAccount}
                disabled={loadingAction}
              >
                {loadingAction ? "Processing..." : "Delete Account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
