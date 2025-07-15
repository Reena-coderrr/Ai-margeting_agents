"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, Mail, Building, Calendar, Crown, CreditCard } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    company: "Digital Marketing Pro",
    joinDate: "2024-01-15",
    plan: "Free Trial",
    trialDaysLeft: 5,
  })

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving user info:", userInfo)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile" />
                <AvatarFallback className="text-2xl">
                  {userInfo.firstName[0]}
                  {userInfo.lastName[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {userInfo.firstName} {userInfo.lastName}
                </h2>
                <p className="text-gray-600">{userInfo.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    {userInfo.plan} - {userInfo.trialDaysLeft} days left
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Member since {new Date(userInfo.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="usage">Usage Stats</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={userInfo.firstName}
                      onChange={(e) => setUserInfo((prev) => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={userInfo.lastName}
                      onChange={(e) => setUserInfo((prev) => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="company"
                      className="pl-10"
                      value={userInfo.company}
                      onChange={(e) => setUserInfo((prev) => ({ ...prev, company: e.target.value }))}
                    />
                  </div>
                </div>

                <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Manage your subscription and billing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-orange-800">Free Trial</h3>
                      <p className="text-orange-600">Access to 2 AI tools • {userInfo.trialDaysLeft} days remaining</p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">Active</Badge>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium mb-4">Available Upgrades</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-semibold">Starter</h5>
                        <p className="text-2xl font-bold text-blue-600">
                          $29<span className="text-sm text-gray-500">/mo</span>
                        </p>
                        <p className="text-sm text-gray-600">5 tools, 30 generations</p>
                        <Button variant="outline" className="w-full mt-3 bg-transparent">
                          Select Plan
                        </Button>
                      </div>

                      <div className="p-4 border-2 border-purple-500 rounded-lg relative">
                        <Badge className="absolute -top-2 left-4 bg-purple-500">Popular</Badge>
                        <h5 className="font-semibold">Pro</h5>
                        <p className="text-2xl font-bold text-purple-600">
                          $69<span className="text-sm text-gray-500">/mo</span>
                        </p>
                        <p className="text-sm text-gray-600">All 13 tools, 100 generations</p>
                        <Button className="w-full mt-3 bg-purple-600 hover:bg-purple-700">Select Plan</Button>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h5 className="font-semibold">Agency</h5>
                        <p className="text-2xl font-bold text-orange-600">
                          $149<span className="text-sm text-gray-500">/mo</span>
                        </p>
                        <p className="text-sm text-gray-600">Unlimited usage, white-label</p>
                        <Button variant="outline" className="w-full mt-3 bg-transparent">
                          Contact Sales
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>Track your AI tool usage and generations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-gray-600">Total Generations</div>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">2</div>
                    <div className="text-sm text-gray-600">Tools Used</div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">3</div>
                    <div className="text-sm text-gray-600">Active Projects</div>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="font-medium mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">SEO Audit Tool</p>
                        <p className="text-sm text-gray-600">Generated audit report for example.com</p>
                      </div>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Social Media Generator</p>
                        <p className="text-sm text-gray-600">Created 5 Instagram posts for campaign</p>
                      </div>
                      <span className="text-sm text-gray-500">1 day ago</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">SEO Audit Tool</p>
                        <p className="text-sm text-gray-600">Analyzed website performance metrics</p>
                      </div>
                      <span className="text-sm text-gray-500">3 days ago</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Billing Information
                </CardTitle>
                <CardDescription>Manage your payment methods and billing history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800">Free Trial Active</h4>
                    <p className="text-blue-600">No payment method required during trial period</p>
                    <p className="text-sm text-blue-600 mt-2">
                      Trial ends on {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Billing History</h4>
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No billing history available</p>
                      <p className="text-sm">Billing history will appear here after your first payment</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                      Add Payment Method
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
