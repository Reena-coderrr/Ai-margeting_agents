"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Settings, User, LogOut, Crown, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const [user, setUser] = useState({ firstName: "", lastName: "", email: "" });
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  useEffect(() => {
    async function fetchNotifications() {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      const res = await fetch("http://localhost:5000/api/user/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotifications(await res.json());
      }
    }
    if (notificationsOpen) {
      fetchNotifications();
    }
  }, [notificationsOpen]);

  const handleSignOut = () => {
    // Clear any stored authentication data
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      localStorage.removeItem("authToken")
      sessionStorage.clear()
    }

    // Redirect to login page
    router.push("/auth/login")
  }

  const handleProfileClick = () => {
    router.push("/profile")
  }

  const handleSettingsClick = () => {
    router.push("/settings")
  }

  const handleUpgradeClick = () => {
    router.push("/upgrade")
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Marketing Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Plan Badge */}
          <Badge className="bg-orange-100 text-orange-800 font-semibold cursor-pointer" onClick={handleUpgradeClick}>
            <Crown className="w-3 h-3 mr-1" />
            Free Trial
          </Badge>

          {/* Notifications Dropdown */}
          <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <div className="px-3 py-2 font-semibold text-gray-700">Notifications</div>
              {notifications.length === 0 ? (
                <DropdownMenuItem className="text-gray-500">No new notifications</DropdownMenuItem>
              ) : (
                notifications.map((notif: any) => (
                  <DropdownMenuItem key={notif._id} className="whitespace-normal">
                    {notif.message}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                  <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold">JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
