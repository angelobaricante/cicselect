"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { mockCampaigns } from "@/lib/mock-data"
import type { Campaign } from "@/lib/types"

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login?role=admin")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "admin") {
      router.push("/login?role=admin")
      return
    }

    setUser(parsedUser)
    setCampaigns(mockCampaigns)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleCreateCampaign = () => {
    router.push("/admin/create-campaign")
  }

  const handleViewResults = (campaignId: string) => {
    router.push(`/admin/results/${campaignId}`)
  }

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8 lg:px-10">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleCreateCampaign}>
              New Election
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {campaigns.map((campaign) => {
            const isActive = new Date(campaign.deadline) > new Date()
            return (
              <div
                key={campaign.id}
                className="flex flex-col rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
              >
                <div className="mb-3 flex-1">
                  <div className="flex items-start justify-between">
                    <h2 className="font-medium">{campaign.title}</h2>
                    <div className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium dark:bg-gray-700">
                      {isActive ? "Active" : "Closed"}
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {isActive
                      ? `Ends: ${new Date(campaign.deadline).toLocaleDateString()}`
                      : `Ended: ${new Date(campaign.deadline).toLocaleDateString()}`}
                  </p>
                </div>
                <div className="mt-auto">
                  <Button
                    variant={isActive ? "outline" : "default"}
                    className="w-full"
                    size="sm"
                    onClick={() => handleViewResults(campaign.id)}
                  >
                    View Results
                  </Button>
                </div>
              </div>
            )
          })}

          {campaigns.length === 0 && (
            <div className="col-span-full rounded-lg border border-dashed border-gray-200 dark:border-gray-600 p-6 text-center text-gray-500 dark:text-gray-400">
              No elections available.
              <Button className="mt-2" size="sm" onClick={handleCreateCampaign}>
                Create New Election
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

