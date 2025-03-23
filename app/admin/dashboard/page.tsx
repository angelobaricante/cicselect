"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getCampaigns, Campaign } from "@/lib/db/campaign-service"
import { CalendarIcon, PlusIcon, UsersIcon } from "lucide-react"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

    loadCampaigns()
  }, [router])

  const loadCampaigns = async () => {
    try {
      setIsLoading(true)
      const data = await getCampaigns()
      setCampaigns(data)
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

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8 lg:px-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/admin/debug")}>
              Debug Connection
            </Button>
            <Button onClick={() => router.push("/admin/create-campaign")}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Election
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                  </div>
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
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-gray-500" />
                      <span>Deadline: {formatDate(campaign.deadline)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UsersIcon className="h-4 w-4 text-gray-500" />
                      <span>Created: {new Date(campaign.created_at || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/admin/campaigns/${campaign.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
              <h3 className="mb-2 text-lg font-medium">No Elections Yet</h3>
              <p className="mb-6 text-sm text-gray-500">Get started by creating your first election campaign.</p>
              <Button onClick={() => router.push("/admin/create-campaign")}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Create New Election
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

