"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { X, Plus, ChevronDown, ChevronUp } from "lucide-react"

type Candidate = {
  id: string
  name: string
  course: string
  position: string
  platform?: string
}

export default function CreateCampaignPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [deadline, setDeadline] = useState("")
  const [positions, setPositions] = useState<string[]>(["President", "Vice President", "Secretary"])
  const [newPosition, setNewPosition] = useState("")
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [expandedPosition, setExpandedPosition] = useState<string | null>(null)

  // New candidate form
  const [newCandidate, setNewCandidate] = useState<Partial<Candidate>>({
    name: "",
    course: "",
    position: "",
    platform: "",
  })

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

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setDeadline(tomorrow.toISOString().split("T")[0])
  }, [router])

  const handleAddPosition = () => {
    if (newPosition.trim() === "") return
    if (positions.includes(newPosition.trim())) return

    setPositions([...positions, newPosition.trim()])
    setNewPosition("")
  }

  const handleRemovePosition = (position: string) => {
    // Remove the position
    setPositions(positions.filter((p) => p !== position))

    // Remove any candidates for this position
    setCandidates(candidates.filter((c) => c.position !== position))
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

    // Add the candidate
    const newCandidateObj: Candidate = {
      id: `candidate${Date.now()}`,
      name: newCandidate.name,
      course: newCandidate.course,
      position: newCandidate.position,
      platform: newCandidate.platform,
    }

    setCandidates([...candidates, newCandidateObj])

    // Reset form but keep the position
    setNewCandidate({
      name: "",
      course: "",
      position: newCandidate.position,
      platform: "",
    })

    toast({
      title: "Candidate Added",
      description: "The candidate has been successfully added.",
    })
  }

  const handleRemoveCandidate = (candidateId: string) => {
    setCandidates(candidates.filter((c) => c.id !== candidateId))
  }

  const togglePositionExpand = (position: string) => {
    if (expandedPosition === position) {
      setExpandedPosition(null)
    } else {
      setExpandedPosition(position)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please provide a title for the election",
        variant: "destructive",
      })
      return
    }

    if (!deadline) {
      toast({
        title: "Missing Deadline",
        description: "Please set a deadline for the election",
        variant: "destructive",
      })
      return
    }

    if (positions.length === 0) {
      toast({
        title: "No Positions",
        description: "Please add at least one position",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Election Created",
      description: "Your election has been created",
    })

    setTimeout(() => {
      router.push("/admin/dashboard")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8 lg:px-10">
        <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="outline" size="sm" onClick={() => router.push("/admin/dashboard")}>
            Back
          </Button>
          <h1 className="text-xl font-bold">Create New Election</h1>
          <div className="hidden sm:block sm:w-[70px]"></div> {/* Spacer for alignment on desktop */}
        </div>

        <Tabs defaultValue="details" className="mx-auto max-w-4xl">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="details">Election Details</TabsTrigger>
            <TabsTrigger value="candidates">Add Candidates</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Election Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., CICS Student Council Election 2025"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Voting Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Positions</Label>
                <div className="flex flex-wrap gap-2">
                  {positions.map((position) => (
                    <div
                      key={position}
                      className="flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm dark:bg-gray-700"
                    >
                      <span>{position}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-5 w-5 rounded-full p-0"
                        onClick={() => handleRemovePosition(position)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {position}</span>
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Add a position..."
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddPosition()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={handleAddPosition}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="button" onClick={() => document.querySelector('[data-value="candidates"]')?.click()}>
                  Next: Add Candidates
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="candidates">
            <div className="space-y-6">
              <Card className="border-gray-200 dark:border-gray-700">
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
                      {positions.map((position) => (
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

                  <Button onClick={handleAddCandidate} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Candidate
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Current Candidates</h3>

                {positions.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-200 dark:border-gray-600 p-4 text-center">
                    <p className="text-gray-500">Please add positions first in the Election Details tab.</p>
                  </div>
                ) : (
                  positions.map((position) => {
                    const positionCandidates = candidates.filter((c) => c.position === position)
                    const isExpanded = expandedPosition === position

                    return (
                      <div key={position} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <div
                          className="flex cursor-pointer items-center justify-between"
                          onClick={() => togglePositionExpand(position)}
                        >
                          <h4 className="font-medium">{position}</h4>
                          <div className="flex items-center">
                            <span className="mr-2 text-sm text-gray-500">
                              {positionCandidates.length} candidate{positionCandidates.length !== 1 ? "s" : ""}
                            </span>
                            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-3 space-y-3">
                            {positionCandidates.length > 0 ? (
                              positionCandidates.map((candidate) => (
                                <div
                                  key={candidate.id}
                                  className="flex items-center justify-between rounded border border-gray-200 dark:border-gray-700 p-3"
                                >
                                  <div>
                                    <p className="font-medium">{candidate.name}</p>
                                    <p className="text-sm text-gray-500">{candidate.course}</p>
                                    {candidate.platform && <p className="mt-1 text-sm">{candidate.platform}</p>}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveCandidate(candidate.id)}
                                    className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                                  >
                                    <X className="h-5 w-5" />
                                    <span className="sr-only">Remove candidate</span>
                                  </Button>
                                </div>
                              ))
                            ) : (
                              <div className="rounded border border-dashed border-gray-200 dark:border-gray-600 p-3 text-center">
                                <p className="text-gray-500">No candidates for this position yet.</p>
                              </div>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => {
                                setNewCandidate({ ...newCandidate, position })
                                document.getElementById("candidateName")?.focus()
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Candidate for {position}
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.querySelector('[data-value="details"]')?.click()}
                >
                  Back to Details
                </Button>
                <Button type="button" onClick={handleSubmit}>
                  Create Election
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

