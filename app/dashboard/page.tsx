"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, CheckSquare } from "lucide-react"
import { getCampaigns, Campaign } from "@/lib/db/campaign-service"

export default function VoterDashboardPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState("")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login?role=voter")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "voter") {
      router.push("/login?role=voter")
      return
    }

    setUsername(parsedUser.name || parsedUser.username)
    loadCampaigns()
  }, [router])

  const loadCampaigns = async () => {
    try {
      setIsLoading(true)
      const data = await getCampaigns()
      
      // Filter only active campaigns (deadline is in the future)
      const activeCampaigns = data.filter(campaign => 
        new Date(campaign.deadline) >= new Date()
      )
      
      setCampaigns(activeCampaigns)
    } catch (error) {
      console.error("Error loading campaigns:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8 lg:px-10">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold">Student Dashboard</h1>
            <p className="text-gray-500">Welcome, {username}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <h2 className="mb-6 text-xl font-semibold">Active Elections</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-9 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                </CardFooter>
              </Card>
            ))
          ) : campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <Card key={campaign.id} className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle>{campaign.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Ends on {formatDate(campaign.deadline)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => router.push(`/vote/${campaign.id}`)}>
                    Vote Now
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
              <h3 className="mb-2 text-lg font-medium">No Active Elections</h3>
              <p className="text-sm text-gray-500">
                There are no active elections at the moment. Please check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 