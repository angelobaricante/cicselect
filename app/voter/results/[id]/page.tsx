"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import type { Campaign, Result, Candidate } from "@/lib/types"
import { getElectionVotes, getTotalVotes, Vote } from "@/lib/vote-utils"

// Extending Campaign type to ensure it has candidates
interface ElectionWithCandidates extends Campaign {
  candidates: Candidate[]
}

// Process vote data into results format
const processVotes = (election: ElectionWithCandidates, votes: Vote[]): Record<string, Result[]> => {
  const resultsByPosition: Record<string, Result[]> = {}
  
  // Initialize results structure
  election.positions.forEach(position => {
    resultsByPosition[position] = []
    
    // Get candidates for this position
    const positionCandidates = election.candidates.filter(c => c.position === position)
    
    // Create a result entry for each candidate with zero votes initially
    positionCandidates.forEach(candidate => {
      resultsByPosition[position].push({
        campaignId: election.id,
        position,
        candidateId: candidate.id,
        votes: 0
      })
    })
  })
  
  // Count votes for each candidate
  votes.forEach(vote => {
    Object.entries(vote.votes).forEach(([position, candidateId]) => {
      const candidateResult = resultsByPosition[position]?.find(
        result => result.candidateId === candidateId
      )
      
      if (candidateResult) {
        candidateResult.votes++
      }
    })
  })
  
  // Sort each position's results by vote count (descending)
  Object.keys(resultsByPosition).forEach(position => {
    resultsByPosition[position].sort((a, b) => b.votes - a.votes)
  })
  
  return resultsByPosition
}

export default function ResultsPage() {
  const router = useRouter()
  const params = useParams()
  const [campaign, setCampaign] = useState<ElectionWithCandidates | null>(null)
  const [results, setResults] = useState<Record<string, Result[]>>({})
  const [loading, setLoading] = useState(true)
  const [totalVotes, setTotalVotes] = useState(0)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const campaignId = params.id as string
    
    // Get election from localStorage
    const electionsData = localStorage.getItem("elections")
    if (!electionsData) {
      toast.error("No Elections Found", {
        description: "No elections data available."
      })
      router.push("/voter/dashboard")
      return
    }
    
    const elections = JSON.parse(electionsData)
    const foundCampaign = elections.find((c: ElectionWithCandidates) => c.id === campaignId)

    if (!foundCampaign) {
      toast.error("Not Found", {
        description: "The requested election could not be found"
      })
      router.push("/voter/dashboard")
      return
    }

    setCampaign(foundCampaign)

    // Get votes data using the utility function
    const electionVotes = getElectionVotes(campaignId)
    const voteCount = getTotalVotes(campaignId)
    setTotalVotes(voteCount)
    
    // Process votes into results
    const processedResults = processVotes(foundCampaign, electionVotes)
    setResults(processedResults)
    
    setLoading(false)
  }, [params.id, router])

  if (loading) return <div className="p-4">Loading...</div>

  // Find the maximum votes for each position to calculate percentages
  const maxVotesByPosition: Record<string, number> = {}
  Object.entries(results).forEach(([position, positionResults]) => {
    maxVotesByPosition[position] = Math.max(...positionResults.map((r) => r.votes), 1)
  })

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8 lg:px-10">
        <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="outline" size="sm" onClick={() => router.push("/voter/dashboard")}>
            Back
          </Button>
          <h1 className="text-xl font-bold">Results: {campaign?.title}</h1>
          <div className="hidden sm:block sm:w-[70px]"></div> {/* Spacer for alignment on desktop */}
        </div>
        
        <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
          <p className="text-lg font-medium">Total Votes: {totalVotes}</p>
          <p className="text-sm text-gray-500">
            {campaign && new Date(campaign.deadline) > new Date() 
              ? 'Voting is still in progress' 
              : 'Voting has ended'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaign?.positions.map((position) => (
            <div key={position} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
              <h2 className="mb-3 font-medium">{position}</h2>

              <div className="space-y-3">
                {results[position]?.map((result, idx) => {
                  const candidate = campaign.candidates.find((c) => c.id === result.candidateId)
                  const percentage = maxVotesByPosition[position] > 0
                    ? Math.round((result.votes / maxVotesByPosition[position]) * 100)
                    : 0

                  return (
                    <div key={result.candidateId} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="truncate pr-2">
                          {candidate?.name}
                          {idx === 0 && result.votes > 0 && campaign && new Date(campaign.deadline) < new Date() && (
                            <span className="ml-1 text-xs text-green-600 dark:text-green-400">(Winner)</span>
                          )}
                        </div>
                        <div className="whitespace-nowrap text-xs text-gray-500">
                          {result.votes} {maxVotesByPosition[position] > 0 ? `(${percentage}%)` : ''}
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
                
                {(!results[position] || results[position].length === 0) && (
                  <div className="text-center text-sm text-gray-500">
                    No candidates for this position
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

