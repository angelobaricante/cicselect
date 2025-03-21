"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { mockCampaigns, mockCandidates } from "@/lib/mock-data"
import type { Campaign, Candidate } from "@/lib/types"
import { Plus, Trash2, Save } from "lucide-react"

export default function ManageCampaignPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [deadline, setDeadline] = useState("")

  // New candidate form
  const [newCandidate, setNewCandidate] = useState<Partial<Candidate>>({
    name: "",
    course: "",
    position: "",
    platform: "",
  })

  useEffect(() => {
    // Check if user is logged in
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

    // Fetch campaign data
    const campaignId = params.id as string
    const foundCampaign = mockCampaigns.find((c) => c.id === campaignId)

    if (!foundCampaign) {
      toast({
        title: "Campaign Not Found",
        description: "The requested campaign could not be found.",
        variant: "destructive",
      })
      router.push("/admin/dashboard")
      return
    }

    setCampaign(foundCampaign)
    setTitle(foundCampaign.title)
    setDescription(foundCampaign.description)
    setDeadline(new Date(foundCampaign.deadline).toISOString().split("T")[0])

    // Fetch candidates
    const campaignCandidates = mockCandidates.filter((c) => c.campaignId === campaignId)
    setCandidates(campaignCandidates)

    setLoading(false)
  }, [params.id, router, toast])

  const handleSaveCampaign = () => {
    // Validate form
    if (!title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please provide a title for the campaign.",
        variant: "destructive",
      })
      return
    }

    if (!deadline) {
      toast({
        title: "Missing Deadline",
        description: "Please set a deadline for the campaign.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would be an API call to update the campaign
    toast({
      title: "Campaign Updated",
      description: "Campaign details have been successfully updated.",
    })
  }

  const handleAddCandidate = () => {
    // Validate form
    if (!newCandidate.name?.trim()) {
      toast({
        title: "Missing Name",
        description: "Please provide the candidate's name.",
        variant: "destructive",
      })
      return
    }

    if (!newCandidate.course?.trim()) {
      toast({
        title: "Missing Course",
        description: "Please provide the candidate's course.",
        variant: "destructive",
      })
      return
    }

    if (!newCandidate.position?.trim()) {
      toast({
        title: "Missing Position",
        description: "Please select a position for the candidate.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would be an API call to add the candidate
    const newCandidateObj: Candidate = {
      id: `candidate${Date.now()}`,
      campaignId: campaign?.id || "",
      name: newCandidate.name,
      course: newCandidate.course,
      position: newCandidate.position,
      platform: newCandidate.platform,
    }

    setCandidates([...candidates, newCandidateObj])

    // Reset form
    setNewCandidate({
      name: "",
      course: "",
      position: "",
      platform: "",
    })

    toast({
      title: "Candidate Added",
      description: "The candidate has been successfully added to the campaign.",
    })
  }

  const handleRemoveCandidate = (candidateId: string) => {
    setCandidates(candidates.filter((c) => c.id !== candidateId))

    toast({
      title: "Candidate Removed",
      description: "The candidate has been removed from the campaign.",
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="outline" onClick={() => router.push("/admin/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <div className="mx-auto max-w-5xl">
          <Card className="mb-6 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Manage Campaign: {campaign?.title}</CardTitle>
              <CardDescription>Update campaign details and manage candidates</CardDescription>
            </CardHeader>
          </Card>

          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Campaign Details</TabsTrigger>
              <TabsTrigger value="candidates">Manage Candidates</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Campaign Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Campaign Title</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">Voting Deadline</Label>
                    <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Positions</Label>
                    <div className="flex flex-wrap gap-2">
                      {campaign?.positions.map((position) => (
                        <div key={position} className="rounded-full bg-blue-100 px-3 py-1 text-sm dark:bg-gray-700">
                          {position}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Note: Positions cannot be modified after campaign creation to maintain data integrity.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveCampaign}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="candidates">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Add New Candidate</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="candidateName">Candidate Name</Label>
                      <Input
                        id="candidateName"
                        value={newCandidate.name}
                        onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                        placeholder="Full Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="candidateCourse">Course</Label>
                      <Input
                        id="candidateCourse"
                        value={newCandidate.course}
                        onChange={(e) => setNewCandidate({ ...newCandidate, course: e.target.value })}
                        placeholder="e.g., BS Computer Science"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="candidatePosition">Position</Label>
                    <select
                      id="candidatePosition"
                      className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-background px-3 py-2"
                      value={newCandidate.position}
                      onChange={(e) => setNewCandidate({ ...newCandidate, position: e.target.value })}
                    >
                      <option value="">Select a position</option>
                      {campaign?.positions.map((position) => (
                        <option key={position} value={position}>
                          {position}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="candidatePlatform">Platform (Optional)</Label>
                    <Textarea
                      id="candidatePlatform"
                      value={newCandidate.platform}
                      onChange={(e) => setNewCandidate({ ...newCandidate, platform: e.target.value })}
                      placeholder="Candidate's platform or advocacy"
                      rows={3}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleAddCandidate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Candidate
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Candidates</CardTitle>
                </CardHeader>
                <CardContent>
                  {campaign?.positions.map((position) => (
                    <div key={position} className="mb-6">
                      <h3 className="mb-3 text-lg font-semibold">{position}</h3>
                      <div className="space-y-3">
                        {candidates
                          .filter((candidate) => candidate.position === position)
                          .map((candidate) => (
                            <div
                              key={candidate.id}
                              className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                            >
                              <div>
                                <p className="font-medium">{candidate.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.course}</p>
                                {candidate.platform && <p className="mt-1 text-sm">{candidate.platform}</p>}
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveCandidate(candidate.id)}>
                                <Trash2 className="h-5 w-5 text-red-500" />
                                <span className="sr-only">Remove candidate</span>
                              </Button>
                            </div>
                          ))}

                        {candidates.filter((candidate) => candidate.position === position).length === 0 && (
                          <div className="rounded-lg border border-dashed border-gray-200 dark:border-gray-600 p-4 text-center">
                            <p className="text-gray-500 dark:text-gray-400">No candidates for this position yet.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

