"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { Campaign } from "@/lib/types"
import { getTotalVotes } from "@/lib/vote-utils"

type Election = {
  id: string
  title: string
  deadline: string
  positions: string[]
  candidates: {
    id: string
    name: string
    course: string
    position: string
    platform?: string
  }[]
  createdAt: string
  status: 'active' | 'completed' | 'upcoming'
}

type CampaignStatus = 'active' | 'completed' | 'upcoming'

export default function AdminDashboard() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      toast.error("Authentication Required", {
        description: "Please login to access the admin dashboard."
      })
      router.push("/login?role=admin")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "admin") {
      toast.error("Access Denied", {
        description: "You don't have permission to access the admin dashboard."
      })
      router.push("/login?role=admin")
      return
    }
    
    // Load elections from localStorage
    const electionsData = localStorage.getItem('elections')
    if (electionsData) {
      const elections = JSON.parse(electionsData) as Election[]
      
      try {
        // Get vote counts for each election
        const counts: Record<string, number> = {}
        elections.forEach(election => {
          counts[election.id] = getTotalVotes(election.id)
        })
        setVoteCounts(counts)
        
        // Convert to Campaign format
        const campaignsFromStorage = elections.map(election => ({
          id: election.id,
          title: election.title,
          description: `Election with ${election.positions.length} positions and ${election.candidates.length} candidates`,
          deadline: election.deadline,
          positions: election.positions,
          hasVoted: false,
          status: election.status
        }))
        
        setCampaigns(campaignsFromStorage)
        
        toast.success("Welcome Admin", {
          description: `You have ${campaignsFromStorage.length} election${campaignsFromStorage.length !== 1 ? 's' : ''} available.`
        })
      } catch {
        toast.error("Data Loading Error", {
          description: "There was a problem loading the election data."
        })
      }
    }
    
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    toast.success("Logged Out", {
      description: "You have been successfully logged out."
    })
    router.push("/")
  }

  const handleCreateCampaign = () => {
    router.push("/admin/create-campaign")
  }

  const handleViewResults = (campaignId: string) => {
    router.push(`/admin/results/${campaignId}`)
  }
  
  const handleManageCampaign = (campaignId: string) => {
    router.push(`/admin/manage-campaign/${campaignId}`)
  }

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="min-h-screen">
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
            const status = (campaign as { status?: CampaignStatus }).status || 
              (new Date(campaign.deadline) > new Date() ? 'active' : 'completed')
            
            const voteCount = voteCounts[campaign.id] || 0
            
            return (
              <div
                key={campaign.id}
                className="flex flex-col rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
              >
                <div className="mb-3 flex-1">
                  <div className="flex items-start justify-between">
                    <h2 className="font-medium">{campaign.title}</h2>
                    <div 
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                        status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        status === 'upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {status === 'active' ? 'Active' : 
                       status === 'upcoming' ? 'Upcoming' : 'Completed'}
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {status === 'completed'
                      ? `Ended: ${new Date(campaign.deadline).toLocaleDateString()}`
                      : `Deadline: ${new Date(campaign.deadline).toLocaleDateString()}`}
                  </p>
                  <div className="mt-2 flex justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {campaign.positions.length} positions
                    </p>
                    <p className="text-xs font-medium">
                      {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
                    </p>
                  </div>
                </div>
                <div className="mt-auto space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    size="sm"
                    onClick={() => handleManageCampaign(campaign.id)}
                  >
                    Manage
                  </Button>
                  <Button
                    variant="default"
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
            <div className="col-span-full flex min-h-[50vh] items-center justify-center">
              <div className="w-full max-w-md rounded-lg border border-dashed border-gray-200 dark:border-gray-600 p-6 text-center">
                <p className="mb-2 text-gray-500 dark:text-gray-400">No elections available</p>
                <Button 
                  onClick={handleCreateCampaign}
                  className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                >
                  Create New Election
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

