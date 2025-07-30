"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const [profileRes, projectsRes] = await Promise.all([
          fetch("http://localhost:5000/api/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/users/projects", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Check if responses are ok before parsing JSON
        if (!profileRes.ok) {
          throw new Error(`Profile request failed: ${profileRes.status} ${profileRes.statusText}`);
        }
        if (!projectsRes.ok) {
          throw new Error(`Projects request failed: ${projectsRes.status} ${projectsRes.statusText}`);
        }

        const profileData = await profileRes.json();
        const projectsData = await projectsRes.json();
        setProfile({
          ...profileData.user,
          projects: Array.isArray(projectsData) ? projectsData : [],
          recentActivity: profileData.recentActivity || [],
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set a basic profile structure if API calls fail
        setProfile({
          firstName: 'User',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          subscription: { plan: 'free_trial', status: 'trial' },
          projects: [],
          recentActivity: []
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Refresh data when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Listen for profile updates from child components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lastProfileUpdate') {
        fetchData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for localStorage changes in the same window
    const checkForUpdates = () => {
      const lastUpdate = localStorage.getItem('lastProfileUpdate');
      if (lastUpdate && parseInt(lastUpdate) > Date.now() - 10000) {
        fetchData();
      }
    };
    const updateInterval = setInterval(checkForUpdates, 5000);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(updateInterval);
    };
  }, []);

  if (loading || !profile) return <div>Loading...</div>;

  return (
    <>
      <DashboardHeader />
      <DashboardContent activeTab="overview" profile={profile} />
    </>
  );
}
