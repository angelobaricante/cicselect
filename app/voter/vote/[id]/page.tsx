"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import type { Campaign, Candidate } from "@/lib/types"
import { addVote, hasVoted } from "@/lib/vote-utils"

type User = {
  id: string
  name: string
  role: string
}

export default function VotePage() {
  const router = useRouter()
  const params = useParams()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [candidates, setCandidates] = useState<Record<string, Candidate[]>>({})
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const userData = localStorage.getItem("user")
      if (!userData) {
        router.push("/login?role=voter")
        return false
      }

      const parsedUser = JSON.parse(userData) as User
      if (parsedUser.role !== "voter") {
        router.push("/login?role=voter")
        return false
      }

      setUser(parsedUser)
      return parsedUser
    }

    const loadElection = async (parsedUser: User) => {
      const campaignId = params.id as string
      
      // Get election from localStorage
      const electionsData = localStorage.getItem("elections")
      if (!electionsData) {
        toast.error("No Elections Found")
        router.push("/voter/dashboard")
        return
      }
      
      const elections = JSON.parse(electionsData)
      const foundCampaign = elections.find((c: Campaign) => c.id === campaignId)

      if (!foundCampaign) {
        toast.error("Election Not Found")
        router.push("/voter/dashboard")
        return
      }

      // Check if user has already voted
      if (hasVoted(campaignId, parsedUser.id)) {
        toast.error("Already Voted")
        router.push("/voter/dashboard")
        return
      }

      // Check if election is still active
      if (new Date(foundCampaign.deadline) <= new Date()) {
        toast.error("Election Closed")
        router.push("/voter/dashboard")
        return
      }

      setCampaign(foundCampaign)

      // Group candidates by position
      const candidatesByPosition: Record<string, Candidate[]> = {}
      foundCampaign.candidates.forEach((candidate: Candidate) => {
        if (!candidatesByPosition[candidate.position]) {
          candidatesByPosition[candidate.position] = []
        }
        candidatesByPosition[candidate.position].push(candidate)
      })

      setCandidates(candidatesByPosition)
      setLoading(false)
    }

    const initializePage = async () => {
      const user = await checkAuth()
      if (user) {
        await loadElection(user)
      }
    }

    initializePage()
  }, [params.id, router])

  const handleSelectionChange = (position: string, candidateId: string) => {
    setSelections((prev) => ({
      ...prev,
      [position]: candidateId,
    }))
  }

  const handleSubmitVote = async () => {
    if (isSubmitting) return

    const positions = campaign?.positions || []
    const missingSelections = positions.filter((position) => !selections[position])

    if (missingSelections.length > 0) {
      toast.error("Please select a candidate for all positions")
      return
    }

    try {
      setIsSubmitting(true)
      
      // Record the vote in localStorage
      if (campaign && user) {
        addVote(campaign.id, user.id, selections)
        toast.success("Vote Submitted Successfully! 🎉")
        router.push("/voter/dashboard")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit vote")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8 lg:px-10">
        <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="outline" size="sm" onClick={() => router.push("/voter/dashboard")}>
            Back
          </Button>
          <h1 className="text-xl font-bold">{campaign?.title}</h1>
          <div className="hidden sm:block sm:w-[70px]"></div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaign?.positions.map((position) => (
            <div key={position} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
              <h2 className="mb-3 font-medium">{position}</h2>
              <RadioGroup
                value={selections[position]}
                onValueChange={(value) => handleSelectionChange(position, value)}
              >
                <div className="space-y-2">
                  {candidates[position]?.map((candidate) => (
                    <div
                      key={candidate.id}
                      className={`flex items-center rounded border p-2 ${
                        selections[position] === candidate.id
                          ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-gray-700"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <RadioGroupItem value={candidate.id} id={candidate.id} className="mr-2" />
                      <div className="overflow-hidden">
                        <Label htmlFor={candidate.id} className="block truncate font-medium">
                          {candidate.name}
                        </Label>
                        <p className="truncate text-xs text-gray-500">{candidate.course}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSubmitVote} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Vote"}
          </Button>
        </div>
      </div>
    </div>
  )
}

