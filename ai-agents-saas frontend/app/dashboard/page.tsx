"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <DashboardContent activeTab={activeTab} />
      </div>
    </div>
  )
}
