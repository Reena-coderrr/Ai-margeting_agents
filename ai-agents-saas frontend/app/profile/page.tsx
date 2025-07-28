"use client";
import { useEffect, useState } from "react";
import { ProfileContent } from "@/components/profile-content";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/users/profile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then(res => res.json())
      .then(data => setProfile(data.user));
  }, []);

  if (!profile) return <div>Loading...</div>;

  return <ProfileContent profile={profile} />;
}
