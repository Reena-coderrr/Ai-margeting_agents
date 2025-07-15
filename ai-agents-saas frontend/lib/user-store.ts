"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id?: string
  name?: string
  firstName?: string
  lastName?: string
  email: string
  company?: string
  phone?: string
  joinDate?: string
  plan: string
  trialDaysLeft?: number
  isAuthenticated: boolean
}

interface UserStore {
  user: User
  setUser: (userData: Partial<User>) => void
  updateUser: (userData: Partial<User>) => void
  upgradePlan: (plan: string) => void
  logout: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: {
        id: "",
        name: "",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        company: "Digital Marketing Pro",
        phone: "+1 (555) 123-4567",
        joinDate: "2024-01-15",
        plan: "Free Trial",
        trialDaysLeft: 5,
        isAuthenticated: false,
      },
      setUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),
      updateUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),
      upgradePlan: (plan) =>
        set((state) => ({
          user: {
            ...state.user,
            plan,
            trialDaysLeft: 0,
          },
        })),
      logout: () =>
        set(() => ({
          user: {
            id: "",
            name: "",
            firstName: "",
            lastName: "",
            email: "",
            company: "",
            phone: "",
            joinDate: "",
            plan: "Free Trial",
            trialDaysLeft: 7,
            isAuthenticated: false,
          },
        })),
    }),
    {
      name: "user-storage",
    },
  ),
)
