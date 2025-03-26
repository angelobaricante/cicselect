"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Plus, Trash2, Save } from "lucide-react"

type LocalCandidate = {
  id: string
  name: string
  course: string
  position: string
  platform?: string
}

type Election = {
  id: string
  title: string
  deadline: string
  positions: string[]
  candidates: LocalCandidate[]
  createdAt: string
  status: 'active' | 'completed' | 'upcoming'
}

export default function ManageCampaignPage() {
  const router = useRouter()
  const params = useParams()
  const [election, setElection] = useState<Election | null>(null)
  const [loading, setLoading] = useState(true)

  // Form states
  const [title, setTitle] = useState("")
  const [deadline, setDeadline] = useState("")
  const [candidates, setCandidates] = useState<LocalCandidate[]>([])

  // New candidate form
  const [newCandidate, setNewCandidate] = useState<Partial<LocalCandidate>>({
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

    // Fetch election data from localStorage
    const electionsData = localStorage.getItem('elections')
    if (!electionsData) {
      toast.error("No Elections Found", {
        description: "No elections data available.",
      })
      router.push("/admin/dashboard")
      return
    }

    const elections: Election[] = JSON.parse(electionsData)
    const electionId = params.id as string
    const foundElection = elections.find((e) => e.id === electionId)

    if (!foundElection) {
      toast.error("Election Not Found", {
        description: "The requested election could not be found.",
      })
      router.push("/admin/dashboard")
      return
    }

    setElection(foundElection)
    setTitle(foundElection.title)
    setDeadline(new Date(foundElection.deadline).toISOString().split("T")[0])
    setCandidates(foundElection.candidates)

    setLoading(false)
  }, [params.id, router])

  const updateElectionInStorage = (updatedElection: Election) => {
    const electionsData = localStorage.getItem('elections')
    if (!electionsData) return false
    
    const elections: Election[] = JSON.parse(electionsData)
    const index = elections.findIndex(e => e.id === updatedElection.id)
    
    if (index === -1) return false
    
    elections[index] = updatedElection
    localStorage.setItem('elections', JSON.stringify(elections))
    return true
  }
  
  const getElectionStatus = (deadline: string): 'active' | 'completed' | 'upcoming' => {
    const deadlineDate = new Date(deadline)
    const now = new Date()
    
    // Set time to end of day
    deadlineDate.setHours(23, 59, 59, 999)
    
    if (now > deadlineDate) {
      return 'completed'
    } else if (now.toDateString() === deadlineDate.toDateString()) {
      return 'active'
    } else {
      return 'upcoming'
    }
  }

  const handleSaveCampaign = () => {
    if (!election) return
    
    // Validate form
    if (!title.trim()) {
      toast.error("Missing Title", {
        description: "Please provide a title for the election.",
      })
      return
    }

    if (!deadline) {
      toast.error("Missing Deadline", {
        description: "Please set a deadline for the election.",
      })
      return
    }

    // Show confirmation dialog
    const confirmSave = window.confirm("Are you sure you want to save these changes? This will update the election details.")
    if (!confirmSave) return

    // Update election object
    const updatedElection: Election = {
      ...election,
      title,
      deadline,
      candidates,
      status: getElectionStatus(deadline)
    }
    
    // Save to localStorage
    const success = updateElectionInStorage(updatedElection)
    
    if (success) {
      setElection(updatedElection)
      toast.success("Changes Saved Successfully! 🎉", {
        description: `"${title}" has been updated with ${candidates.length} candidates. The changes are now live.`,
        duration: 5000,
      })
    } else {
      toast.error("Update Failed", {
        description: "Failed to update the election. Please try again.",
      })
    }
  }

  const handleDeleteCampaign = () => {
    if (!election) return

    // Show confirmation dialog with warning
    const confirmDelete = window.confirm(
      `⚠️ Warning: Are you sure you want to delete "${election.title}"?\n\nThis action cannot be undone and will:\n- Delete all election data\n- Remove all votes\n- Remove voter records\n\nPlease confirm to proceed with deletion.`
    )
    if (!confirmDelete) return

    // Get elections from localStorage
    const electionsData = localStorage.getItem('elections')
    if (!electionsData) return

    const elections: Election[] = JSON.parse(electionsData)
    const updatedElections = elections.filter(e => e.id !== election.id)
    
    // Update elections in localStorage
    localStorage.setItem('elections', JSON.stringify(updatedElections))

    // Remove from voted elections in voter's data
    const votedElectionsData = localStorage.getItem('votedElections')
    if (votedElectionsData) {
      const votedElections: Record<string, string[]> = JSON.parse(votedElectionsData)
      // Remove this election from all voters' voted lists
      Object.keys(votedElections).forEach(voterId => {
        votedElections[voterId] = votedElections[voterId].filter(id => id !== election.id)
      })
      localStorage.setItem('votedElections', JSON.stringify(votedElections))
    }

    // Remove votes for this election
    localStorage.removeItem(`votes_${election.id}`)

    toast.error("Election Deleted Successfully! 🗑️", {
      description: "The election and all associated data have been permanently removed.",
      duration: 5000,
    })

    // Redirect to dashboard
    router.push("/admin/dashboard")
  }

  const handleAddCandidate = () => {
    if (!election) return
    
    // Validate form
    if (!newCandidate.name?.trim()) {
      toast.error("Missing Name", {
        description: "Please provide the candidate's name.",
      })
      return
    }

    if (!newCandidate.course?.trim()) {
      toast.error("Missing Course", {
        description: "Please provide the candidate's course.",
      })
      return
    }

    if (!newCandidate.position?.trim()) {
      toast.error("Missing Position", {
        description: "Please select a position for the candidate.",
      })
      return
    }

    // Show confirmation dialog
    const confirmAdd = window.confirm(`Are you sure you want to add ${newCandidate.name} as a candidate for ${newCandidate.position}?`)
    if (!confirmAdd) return

    // Create new candidate
    const newCandidateObj: LocalCandidate = {
      id: `candidate_${Date.now()}`,
      name: newCandidate.name,
      course: newCandidate.course,
      position: newCandidate.position || '',
      platform: newCandidate.platform,
    }

    // Update local state
    const updatedCandidates = [...candidates, newCandidateObj]
    setCandidates(updatedCandidates)
    
    // Update election in localStorage
    const updatedElection: Election = {
      ...election,
      candidates: updatedCandidates
    }
    updateElectionInStorage(updatedElection)
    setElection(updatedElection)

    // Reset form
    setNewCandidate({
      name: "",
      course: "",
      position: newCandidate.position, // Keep the position for easier entry of multiple candidates
      platform: "",
    })

    toast.success("Candidate Added Successfully! 👤", {
      description: `${newCandidateObj.name} has been added as a candidate for ${newCandidateObj.position}.`,
      duration: 5000,
    })
  }

  const handleRemoveCandidate = (candidateId: string) => {
    if (!election) return

    const candidateToRemove = candidates.find(c => c.id === candidateId)
    if (!candidateToRemove) return

    // Show confirmation dialog
    const confirmRemove = window.confirm(
      `Are you sure you want to remove ${candidateToRemove.name} from the ${candidateToRemove.position} position?\n\nThis action cannot be undone.`
    )
    if (!confirmRemove) return
    
    // Update local state
    const updatedCandidates = candidates.filter((c) => c.id !== candidateId)
    setCandidates(updatedCandidates)
    
    // Update election in localStorage
    const updatedElection: Election = {
      ...election,
      candidates: updatedCandidates
    }
    updateElectionInStorage(updatedElection)
    setElection(updatedElection)

    toast.error("Candidate Removed Successfully", {
      description: `${candidateToRemove.name} has been removed from the ${candidateToRemove.position} position.`,
      duration: 5000,
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
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8 lg:px-10">
        <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="outline" size="sm" onClick={() => router.push("/admin/dashboard")}>
            Back
          </Button>
          <h1 className="text-xl font-bold">Manage Election: {election?.title}</h1>
          <div className="hidden sm:block sm:w-[70px]"></div> {/* Spacer for alignment */}
        </div>

        <div className="mx-auto max-w-4xl">
          <Tabs defaultValue="details">
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="details">Election Details</TabsTrigger>
              <TabsTrigger value="candidates">Manage Candidates</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Election Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Election Title</Label>
                    <Input 
                      id="title" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter election title" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">Voting Deadline</Label>
                    <Input 
                      id="deadline" 
                      type="date" 
                      value={deadline} 
                      onChange={(e) => setDeadline(e.target.value)} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Positions</Label>
                    <div className="flex flex-wrap gap-2">
                      {election?.positions.map((position) => (
                        <div
                          key={position}
                          className="flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm dark:bg-gray-700"
                        >
                          {position}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Note: Positions cannot be modified after election creation to maintain data integrity.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-end gap-4">
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteCampaign} 
                    className="order-2 sm:order-none w-full sm:w-auto bg-destructive hover:bg-destructive/90 dark:bg-destructive dark:hover:bg-destructive/90 text-destructive-foreground transition-colors duration-200"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Campaign
                  </Button>
                  <Button onClick={handleSaveCampaign} className="order-1 sm:order-none w-full sm:w-auto">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="candidates">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Candidate</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={newCandidate.name}
                          onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                          placeholder="Full Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="course">Course</Label>
                        <Input
                          id="course"
                          value={newCandidate.course}
                          onChange={(e) => setNewCandidate({ ...newCandidate, course: e.target.value })}
                          placeholder="e.g., BS Computer Science"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <div className="relative">
                        <select
                          id="position"
                          className="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
                          value={newCandidate.position}
                          onChange={(e) => setNewCandidate({ ...newCandidate, position: e.target.value })}
                        >
                          <option value="" className="text-gray-500 dark:text-gray-400">
                            Select a position...
                          </option>
                          {election?.positions.map((position) => (
                            <option 
                              key={position} 
                              value={position}
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {position}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                          <svg
                            className="h-4 w-4 text-gray-400 dark:text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="platform">Platform (Optional)</Label>
                      <Textarea
                        id="platform"
                        value={newCandidate.platform}
                        onChange={(e) => setNewCandidate({ ...newCandidate, platform: e.target.value })}
                        placeholder="Enter candidate's platform or campaign promises..."
                        rows={3}
                      />
                    </div>

                    <Button onClick={handleAddCandidate} className="w-full sm:w-auto">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Candidate
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Current Candidates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {candidates.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-gray-200 dark:border-gray-600 p-6 text-center text-gray-500 dark:text-gray-400">
                        No candidates added yet.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {election?.positions.map((position) => {
                          const positionCandidates = candidates.filter((c) => c.position === position)
                          if (positionCandidates.length === 0) return null

                          return (
                            <div key={position} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                              <h3 className="mb-2 font-medium">{position}</h3>
                              <div className="space-y-2">
                                {positionCandidates.map((candidate) => (
                                  <div
                                    key={candidate.id}
                                    className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900"
                                  >
                                    <div>
                                      <p className="font-medium">{candidate.name}</p>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.course}</p>
                                      {candidate.platform && (
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{candidate.platform}</p>
                                      )}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveCandidate(candidate.id)}
                                      className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Remove</span>
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

